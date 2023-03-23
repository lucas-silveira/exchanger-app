export abstract class Entity {
  public id: number | string;

  constructor(id: number | string) {
    this.setId(id);
  }

  protected setId(anId: number | string): void {
    this.id = anId;
  }

  public isEqualTo(anEntity: Record<string, any>): boolean {
    return this.id === anEntity.id;
  }
}
