import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMeals1700776804328 implements MigrationInterface {
  name = 'AddMeals1700776804328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "meal" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_ada510a5aba19e6bb500f8f7817" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "meal"`);
  }
}
