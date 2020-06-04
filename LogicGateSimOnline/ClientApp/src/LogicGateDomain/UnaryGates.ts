
import { SingleOutputGate } from './BaseClasses';
import { NaryCanonicalGates } from './NaryGates';

export class UnaryGate extends SingleOutputGate {
  type: string = "UnaryGate";
  Input: boolean;

  constructor(name: string) {
    super(name, 1, []);
  }

  public Reset(): void {
    this.Input = false;
    this.Output = false;
    this.IsFilled = false;
  }

  public GetInputCount(): number {
    return 1;
  }

  public SendOutput(): void {
    this.ConnectedGates.forEach(c => c.TargetGate.Activate(c.InputNode, this.Output));
  }

  public CheckOutput(): void { }

  public Activate(inputSide: number, input: boolean): void {
    this.IsFilled = true;
    this.Input = input;
    this.CheckOutput();
  }
}

export module UnaryCanonicalGates {
  export class OutputGate extends UnaryGate {
    type: string = "OutputGate";
    constructor(name: string) {
      super(name);
    }
    public CheckOutput(): void {
      this.Output = this.Input;
    }
  }

  export class NotGate extends UnaryGate {
    type: string = "NotGate";
    constructor(name: string) {
      super(name);
    }
    public CheckOutput(): void {
      this.Output = !this.Input;
      this.SendOutput();
    }
  }

  export class IdentityGate extends UnaryGate {
    type: string = "IdentityGate";
    constructor(name: string) {
      super(name);
    }
    public CheckOutput(): void {
      this.Output = this.Input;
      this.SendOutput();
    }
  }

  export class TrueGate extends UnaryGate {
    type: string = "TrueGate";
    constructor(name: string) {
      super(name);
      this.Input = true;
      this.IsFilled = true;
    }
    public CheckOutput(): void {
      this.Output = true;
      this.SendOutput();
    }
  }

  export class FalseGate extends UnaryGate {
    type: string = "FalseGate";
    constructor(name: string) {
      super(name);
      this.Input = false;
      this.IsFilled = true;
    }
    public CheckOutput(): void {
      this.Output = false;
      this.SendOutput();
    }
  }

  export class InputGate extends UnaryGate {
    type: string = "InputGate";
    constructor(name: string, input: boolean) {
      super(name);
      this.Input = input;
      this.Output = input;
      this.IsFilled = true;
    }

    public SetInput(input: boolean): void {
      this.Input = input;
      this.Output = input;
    }

    public CheckOutput(): void {
      this.Output = this.Input;
      this.SendOutput();
    }

    public Fire(): void {
      this.Output = this.Input;
      this.SendOutput();
    }

    public SetInputAndFire(input: boolean): void {
      this.Input = input;
      this.Output = input;
      this.SendOutput();
    }
  }

  export class Clock extends UnaryGate {
    type: string = "Clock";
    constructor(name: string, interval: number) {
      super(name);
    }
  }

}
