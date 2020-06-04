import { SingleOutputGate } from './BaseClasses';

export class NaryGate extends SingleOutputGate {
  type: string = "NaryGate";
  InputStates: boolean[];
  AreInputsUpdated: boolean[];
  Name: string;

  constructor(name: string, inputCount: number, nameList: string[]) {
    super(name, inputCount, nameList);
    this.InputStates = []; // Store the input states.
    this.AreInputsUpdated = []; // Check if all inputs have been updated.
    this.Name = name;
  }

  public GetName = () => this.Name;

  public Reset(): void {
    // Reset the state of the inputs.
    for (let i = 0; i < this.InputStates.length; i++)
      this.InputStates[i] = false;
    // Reset the update state of the inputs.
    for (let i = 0; i < this.InputStates.length; i++)
      this.AreInputsUpdated[i] = false;

    this.Output = false;
    this.IsFilled = false;
  }

  public CheckOutput(): void { }

  public SendOutput(): void {
    this.ConnectedGates.forEach(c => c.TargetGate.Activate(c.InputNode, this.Output));
  }

  // Update either inputs with a true or false value.
  public Activate(inputSide: number, input: boolean): void {
    // N input behavior
    this.InputStates[inputSide - 1] = input; // input nodes are given as 1, 2, 3, 4, ...; while index are 0, 1, 2, 3, ...
    this.AreInputsUpdated[inputSide - 1] = true;

    if (this.AreInputsUpdated.every(x => x)) {
      this.IsFilled = true;
      this.CheckOutput();
    }
  }
}

export module NaryCanonicalGates {
  export class AndGate extends NaryGate {
    type: string = "AndGate";
    constructor(name: string, inputCount: number, nameList: string[]) {
      super(name, inputCount, nameList);
    }
    public CheckOutput(): void {
      this.Output = this.InputStates.reduce((a, b) => a && b);
      this.SendOutput();
    }
  }

  export class OrGate extends NaryGate {
    type: string = "OrGate";
    constructor(name: string, inputCount: number, nameList: string[]) {
      super(name, inputCount, nameList);
    }
    public CheckOutput(): void {
      this.Output = this.InputStates.reduce((a, b) => a || b);
      this.SendOutput();
    }
  }

  // DifferentGate
  export class XorGate extends NaryGate {
    type: string = "XorGate";
    constructor(name: string, inputCount: number, nameList: string[]) {
      super(name, inputCount, nameList);
    }
    public CheckOutput(): void {
      this.Output = this.InputStates.reduce((a, b) => a !== b);
      this.SendOutput();
    }
  }

  // EqualGate
  export class XnorGate extends NaryGate {
    type: string = "XnorGate";
    constructor(name: string, inputCount: number, nameList: string[]) {
      super(name, inputCount, nameList);
    }
    public CheckOutput(): void {
      this.Output = this.InputStates.reduce((a, b) => a === b);
      this.SendOutput();
    }
  }

  export class NandGate extends NaryGate {
    type: string = "NandGate";
    constructor(name: string, inputCount: number, nameList: string[]) {
      super(name, inputCount, nameList);
    }
    public CheckOutput(): void {
      this.Output = this.InputStates.reduce((a, b) => !(a && b));
      this.SendOutput();
    }
  }

  export class NorGate extends NaryGate {
    type: string = "NorGate";
    constructor(name: string, inputCount: number, nameList: string[]) {
      super(name, inputCount, nameList);
    }
    public CheckOutput(): void {
      this.Output = this.InputStates.reduce((a, b) => !(a && b));
      this.SendOutput();
    }
  }
}

