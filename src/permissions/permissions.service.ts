import { Injectable } from "@nestjs/common";

import { SqlService } from "../sql/sql.service";

@Injectable()
export class PermissionsService {
  constructor(private readonly sqlService: SqlService) {}

  async getAllForUser(userId: number): Promise<string[]> {
    const permissions = await this.sqlService.sql`
      SELECT permissions.code
      FROM permissions
      INNER JOIN users_permissions ON permissions.id = users_permissions.permission_id
      INNER JOIN users ON users_permissions.user_id = users.id
      WHERE users.id = ${userId}
    `;
    return permissions.map((permission) => permission.code);
  }

  async addForUser(userId: number, codes: string[]) {
    await this.sqlService.sql`
    	INSERT INTO users_permissions
    	SELECT ${userId}, permissions.id FROM permissions
    	WHERE permissions.code = ANY(${this.sqlService.sql.array(codes, "TEXT")})
    `;
  }
}
