import { Character } from "./Character";
import type { Weapon } from "./Weapon";

export class Wizard extends Character {
    public static readonly SPELL_COST: number = 10;
    public readonly maxMana: number;
    private _mana: number;

    public constructor(name: string, health: number, baseAttack: number, baseDefense: number, mana: number) {
        if (mana < 0) {
            throw new Error(`The mana of ${name} cannot be negative.`)
        }
        
        super(name,health,baseAttack,baseDefense);
     
        this.maxMana = mana;
        this._mana = mana;
    }

    public get mana(): number {
        return this._mana;
    }

    public set mana(value: number) {
        if (value < 0 || value > this.maxMana) {
            throw new Error(`The mana of ${this.name} must be between 0 and ${this.maxMana}.`);
        }

        this._mana = value;
    }

    public canCastSpell(): boolean {
        return this.mana >= Wizard.SPELL_COST;
    }

    public override getAttack(): number {
        return this.baseAttack + this.getWeaponAttackBonus();
    }

    public override canEquip(weapon: Weapon): boolean {
        return weapon.kind === "staff" || weapon.kind === "dagger" ? true : false;
    }

    public override describe(): string {
        return `[Wizard] ${super.describe()} - mana ${this.mana}/${this.maxMana}`;
    }

    public override attack(target: Character): number {
        let hit: number = super.attack(target);
        const HEAL_PERCENT: number = 0.2;

        if (this.canCastSpell()) {
            this.heal(Math.floor(hit * HEAL_PERCENT));
            this.mana -= Wizard.SPELL_COST;
        }

        return hit;
    }
}