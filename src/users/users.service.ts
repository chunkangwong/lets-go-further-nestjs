import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { PermissionsService } from "../permissions/permissions.service";
import { SqlService } from "../sql.service";
import { TokenScope } from "../tokens/interfaces/token";
import { TokensService } from "../tokens/tokens.service";
import { ActivateBodyDto } from "./dto/activateBody.dto";
import { RegisterBodyDto } from "./dto/registerBody.dto";
import { User } from "./interfaces/user";

@Injectable()
export class UsersService {
  constructor(
    private readonly sqlService: SqlService,
    private readonly permissionsService: PermissionsService,
    private readonly tokensService: TokensService
  ) {}

  async register(body: RegisterBodyDto) {
    const password = await setPassword(body.password);
    const user = {
      name: body.name,
      email: body.email,
      activated: false,
      password,
    };
    let newUser: User;
    try {
      newUser = await this.insert(user);
    } catch (error) {
      if (
        error.message.includes(
          'duplicate key value violates unique constraint "users_email_key"'
        )
      ) {
        throw new BadRequestException("Email already in use");
      }
    }
    await this.permissionsService.addForUser(newUser.id, ["movies:read"]);
    const token = await this.tokensService.newToken(
      newUser.id,
      24 * 60 * 60,
      "activation"
    );
    // TODO: send email with token
    return newUser;
  }

  async activate(body: ActivateBodyDto) {
    const tokenPlainText = body.token;
    const user = await this.getForToken("activation", tokenPlainText);
    user.activated = true;
    const updatedUser = await this.update(user);
    await this.tokensService.deleteAllForUser("activation", updatedUser.id);
    return updatedUser;
  }

  async getForToken(tokenScope: TokenScope, tokenPlainText: string) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(tokenPlainText)
      .digest();

    const [user] = await this.sqlService.sql`
      SELECT users.id, users.created_at, users.name, users.email, users.password_hash, users.activated, users.version
      FROM users
      INNER JOIN tokens
      ON users.id = tokens.user_id
      WHERE tokens.hash = ${tokenHash.toString("hex")}
      AND tokens.scope = ${tokenScope}
      AND tokens.expiry > ${new Date()}
    `;

    if (!user) {
      throw new NotFoundException("Token not found");
    }

    return {
      id: user.id,
      created_at: user.created_at,
      name: user.name,
      email: user.email,
      password: {
        hash: user.password_hash,
      },
      activated: user.activated,
      version: user.version,
    } as User;
  }

  async insert(
    user: Pick<User, "name" | "email" | "password" | "activated">
  ): Promise<User> {
    const [newUser] = await this.sqlService.sql`
      INSERT INTO users ${this.sqlService.sql({
        name: user.name,
        email: user.email,
        password_hash: user.password.hash,
        activated: user.activated,
      })}
      RETURNING *
    `;

    return newUser;
  }

  async update(user: User): Promise<User> {
    const query = `
      UPDATE users
      SET ${this.sqlService.sql({
        name: user.name,
        email: user.email,
        password_hash: user.password.hash,
        activated: user.activated,
        version: user.version + 1,
      })}
      WHERE id = ${user.id} AND version = ${user.version}
      RETURNING *
    `;

    const [updatedUser] = await this.sqlService.sql`
      ${query}
    `;

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    return {
      id: updatedUser.id,
      created_at: updatedUser.created_at,
      name: updatedUser.name,
      email: updatedUser.email,
      password: {
        hash: updatedUser.password_hash,
      },
      activated: updatedUser.activated,
      version: updatedUser.version,
    } as User;
  }
}

const setPassword = async (plaintextPassword: string) => {
  const hash = await bcrypt.hash(plaintextPassword, 12);
  return {
    hash,
    plaintext: plaintextPassword,
  };
};
