import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import bcrypt from "bcrypt";
import crypto from "crypto";
import base32 from "hi-base32";

import { SqlService } from "../sql.service";
import { User } from "../users/interfaces/user";
import { AuthenticateBodyDto } from "./dto/authenticateBody.dto";
import { Token, TokenScope } from "./interfaces/token";

@Injectable()
export class TokensService {
  constructor(private readonly sqlService: SqlService) {}

  async authentication(body: AuthenticateBodyDto) {
    const user = await this.getUserByEmail(body.email);
    const passwordMatch = await bcrypt.compare(
      body.password,
      user.password.hash
    );
    if (!passwordMatch) {
      throw new UnauthorizedException(
        "invalid or missing authentication credentials"
      );
    }

    const token = await this.newToken(user.id, 24 * 60 * 60, "authentication");
    return token;
  }

  async insertToken(token: Token) {
    await this.sqlService.sql`
      INSERT INTO tokens ${this.sqlService.sql({
        hash: token.hash,
        user_id: token.userID,
        expiry: token.expiry,
        scope: token.scope,
      })}
    `;
  }

  async newToken(userID: number, ttl: number, scope: TokenScope) {
    const token = createToken(userID, ttl, scope);
    await this.insertToken(token);
    return token;
  }

  async deleteAllForUser(scope: string, userId: number) {
    const query = `
      DELETE FROM tokens
      WHERE scope = ${scope} AND user_id = ${userId}
    `;

    await this.sqlService.sql`
      ${query}
    `;
  }

  async getUserByEmail(email: string) {
    const [user] = await this.sqlService.sql`
      SELECT id, created_at, name, email, password_hash, activated, version
      FROM users
      WHERE email = ${email}
    `;

    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.password = {
      hash: user.password_hash.toString(),
    };

    return user as User;
  }
}

const createToken = (userID: number, ttl: number, scope: string) => {
  const randomBytes = crypto.randomBytes(32);
  const plaintext = base32.encode(randomBytes).replace(/=+$/, "");
  const hash = crypto.createHash("sha256").update(plaintext).digest();

  return {
    userID,
    expiry: new Date(Date.now() + ttl),
    scope,
    plaintext,
    hash,
  };
};
