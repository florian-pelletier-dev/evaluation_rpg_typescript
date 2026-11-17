import type { Weapon } from "./Weapon";

export abstract class Character {
    public readonly name: string;
    public readonly maxHealth: number;
    public readonly baseAttack: number;
    public readonly baseDefense: number;
    
    private _health: number;
    private _weapon: Weapon | null = null;

    public constructor(name: string, health: number, baseAttack: number, baseDefense: number) {
        if (health <= 0) {
            throw new Error(`The health of ${name} must be strictly positive.`)
        }

        this.name = name;
        this.maxHealth = health;
        this._health = health;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
    }

    public get health(): number {
        return this._health;
    }

    public abstract getAttack(): number;

    public abstract canEquip(weapon: Weapon): boolean;

    protected getWeaponAttackBonus(): number {
        return this._weapon === null ? 0 : this._weapon.attackBonus;
    }

    public isAlive(): boolean {
        return this._health > 0;
    }

    public describe(): string {
        return `${this.name} - health ${this.health}/${this.maxHealth} - attack ${this.getAttack()} - defense ${this.baseDefense} - weapon: ${this._weapon === null ? "none" : this._weapon.name}`;
    }

    public equip(weapon: Weapon): void {
        if (!this.canEquip(weapon)) {
            throw new Error(`${this.name} cannot equip ${weapon.name}.`);
        }

        this._weapon = weapon;
    }

    public takeDamage(amount: number): void {
        this._health = Math.max(0, this.health - amount);
    }

    public heal(amount: number): void {
        this._health = Math.min(this.maxHealth, this.health + amount);
    }

    public computeDamage(target: Character): number {
        return Math.max(0, this.baseAttack + this.getWeaponAttackBonus() - target.baseDefense);
    }

    public attack(target: Character): number {
        console.log(target);

        if (this.health <= 0) {
            throw new Error(`${this.name} is KO and cannot attack.`);
        }

        if (target === this) {
            throw new Error(`${this.name} cannot attack themselves.`);
        }

        if (target.health <= 0) {
            throw new Error(`${target.name} is already KO.`);
        }

        const hit = this.computeDamage(target);
        target.takeDamage(hit);

        console.log(`${this.name} hits ${target.name} for ${hit} damage (${target.name}: ${target.health}/${target.maxHealth}).`);
    
        if (target.health <= 0) {
            console.log(`${target.name} is KO!`);
        }

        return hit;
    }
}