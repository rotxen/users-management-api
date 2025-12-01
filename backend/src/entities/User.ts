import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcryptjs';

/**
 * Entidad User - Representa la tabla de usuarios en PostgreSQL
 * 
 * Decisiones de diseño:
 * - Email único para prevenir duplicados
 * - Password hasheado con bcrypt (salt rounds: 10)
 * - Timestamps automáticos para auditoría
 * - firstName y lastName separados para flexibilidad
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  /**
   * Hook que se ejecuta antes de insertar un nuevo usuario
   * Hashea la contraseña automáticamente
   */
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  /**
   * Hook que se ejecuta antes de actualizar un usuario
   * Hashea la contraseña solo si fue modificada
   */
  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    // Solo hashear si la contraseña fue modificada
    if (this.password && !this.password.startsWith('$2a$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  /**
   * Compara una contraseña plana con el hash almacenado
   * @param plainPassword - Contraseña sin hashear
   * @returns true si coinciden, false en caso contrario
   */
  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  /**
   * Convierte la entidad a JSON excluyendo el password
   * Se utiliza al enviar respuestas al cliente
   */
  toJSON() {
    const { password, ...user } = this;
    return user;
  }
}
