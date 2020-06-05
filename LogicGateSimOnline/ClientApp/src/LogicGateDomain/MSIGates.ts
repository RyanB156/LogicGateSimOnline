import { MultipleOutputGate, SingleOutputGate, IClockable } from './BaseClasses';

export class NDecoder extends MultipleOutputGate {
  type: string = "NDecoder";
  OutputCount: number;
  InputStates: boolean[];
  AreInputsUpdated: boolean[];

  constructor(name: string, inputCount: number, inputNameList: string[], outputNameMap: Map<string, number>) {
    super(name, inputCount, Math.pow(2, inputCount), inputNameList, outputNameMap);
    this.OutputCount = Math.pow(2, inputCount);
    this.InputStates = []; // Multiple inputs to keep track of.
    this.AreInputsUpdated = [];

    this.OutputMap = new Array(this.OutputCount);
    for (let i = 0; i < this.OutputCount; i++) {
      this.OutputMap[i] = [];
    }
  }

  public Activate(inputSide: number, input: boolean) : void {
    this.InputStates[inputSide - 1] = input; // Input numbers are 1 indexed.
    this.AreInputsUpdated[inputSide - 1] = true;

    if (this.AreInputsUpdated.every(x => x)) {
      this.IsFilled = true;
      this.SendOutput();
    }
  }

  // Reads the state of the inputs and returns the decimal value that corresponds to the BCD minterm of the inputs.
  // 000 -> 0, 011 -> 3, 110 -> 6, ...
  private InputMinTerm() : number {
    let term = 0;
    for (let i = 0; i < this.InputStates.length; i++) {
      if (this.InputStates[i])
        term += Math.pow(2, i);
    }
    return term;
  }

  private SendOutput() : void {
    let outputChoice = this.InputMinTerm();
    // Activate all gates connected to all outputs of the decoder.

    for (let i = 0; i < this.OutputCount; i++)
    {
      let output = i == outputChoice; // If the output is the active input based on the input state, that output is active. Otherwise, it is false.

      this.OutputMap[i].forEach(c => {
        c.TargetGate.Activate(c.InputNode, output); // Throws a stack overflow exception.
      })
    }
  }
}

export class Multiplexer extends SingleOutputGate {
  type: string = "Multiplexer";
  ControlCount: number;
  InputStates: boolean[];
  ControlStates: boolean[];
  AreInputsUpdated: boolean[];
  AreControlsUpdated: boolean[];

  // Inputs for a Multiplexer4 given as (control1, control2, input1, input2, input3, input4).
  constructor(name: string, inputCount: number, inputNameList: string[]) {
    super(name, inputCount, inputNameList);
    this.ControlCount = (Math.log(inputCount) / Math.log(2));
    this.InputStates = [];
    this.AreInputsUpdated = [];
    this.ControlStates = [];
    this.AreControlsUpdated = [];
    this.ConnectedGates = [];
  }

  public Activate(inputSide: number, input: boolean) : void {
    if (inputSide >= 1 && inputSide <= this.ControlCount) {
      this.ControlStates[inputSide - 1] = input;
      this.AreControlsUpdated[inputSide - 1] = true;
    }
    else {
      inputSide = inputSide - this.ControlCount;
      this.InputStates[inputSide - 1] = input; // Input numbers are 1 indexed.
      this.AreInputsUpdated[inputSide - 1] = true;
    }

    if (this.AreInputsUpdated.every(x => x) && this.AreControlsUpdated.every(x => x)) {
      this.IsFilled = true;
      this.SendOutput();
    }
  }

  // Reads the state of the inputs and returns the decimal value that corresponds to the BCD minterm of the inputs.
  // 000 -> 0, 011 -> 3, 110 -> 6, ...
  private ControlMinTerm() : number {
    let term = 0;
    for (let i = 0; i < this.ControlStates.length; i++)
    {
      if (this.ControlStates[i])
        term += Math.pow(2, i);
    }
    return term;
  }

  private SendOutput() : void {
    this.Output = this.InputStates[this.ControlMinTerm()];
    this.ConnectedGates.forEach(c => {
      c.TargetGate.Activate(c.InputNode, this.Output);
    });
  }
}

export class DFlipFlop extends MultipleOutputGate implements IClockable {
  type: string = "DFlipFlop";
  D: boolean;

  constructor(name: string, outputNameMap: Map<string, number>) {
    super(name, 1, 2, [], outputNameMap);
    this.OutputMap = []; // Two Outputs. Q and Q'.
    this.OutputMap[0] = [];
    this.OutputMap[1] = [];
  }

  public Activate(inputSide: number, input: boolean): void {
    this.D = input;
    this.IsFilled = true;
  }

  private SendOutput(): void {
    // Qt+1 = D.
    this.OutputMap[0].forEach(c => c.TargetGate.Activate(c.InputNode, this.D));
    this.OutputMap[1].forEach(c => c.TargetGate.Activate(c.InputNode, !this.D));
  }

  // Called from the form's Timer. This causes the Flip Flop to change to the next state.
  // The flip flop only gives its output with the timer. This should prevent an infinite loop.
  public Tick(): void {
    this.SendOutput();
  }
}

export class TFlipFlop extends MultipleOutputGate implements IClockable {
  type: string = "TFlipFlop";
  T: boolean;
  State: boolean;

  constructor(name: string, outputNameMap: Map<string, number>) {
    super(name, 1, 2, [], outputNameMap);
    this.OutputMap = []; // Two Outputs. Q and Q'.
    this.OutputMap[0] = [];
    this.OutputMap[1] = [];
  }

  public Activate(inputSide: number, input: boolean) : void {
    this.T = input;
  }

  private SendOutput() : void {
    this.State !== this.T; // Qt+1 = Q^T.

    this.OutputMap[0].forEach(c => c.TargetGate.Activate(c.InputNode, this.State));
    this.OutputMap[1].forEach(c => c.TargetGate.Activate(c.InputNode, !this.State));
  }

  public Tick() : void {
    this.SendOutput();
  }
}

export class JKFlipFlop extends MultipleOutputGate implements IClockable {
  type: string = "JKFlipFlop";
  J: boolean;
  K: boolean;
  State: boolean;

  constructor(name: string, inputCount: number, inputNameList: string[], outputNameMap: Map<string, number>) {
    super(name, inputCount, 2, inputNameList, outputNameMap);
    this.OutputMap = []; // Two Outputs. Q and Q'.
    this.OutputMap[0] = [];
    this.OutputMap[1] = [];
  }

  public Activate(inputSide: number, input: boolean) : void {
    switch (inputSide) {
      case 0:
        this.J = input;
        break;
      case 1:
        this.K = input;
        break;
    }
  }

  private SendOutput() : void {
    this.State = (!this.K && this.State) || (this.J && !this.State); // Qt+1 = K'Q + JQ'.

    this.OutputMap[0].forEach(c => c.TargetGate.Activate(c.InputNode, this.State));
    this.OutputMap[1].forEach(c => c.TargetGate.Activate(c.InputNode, !this.State));
  }

  public Tick() : void {
    this.SendOutput();
  }
}
