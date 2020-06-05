import { OutputConnection } from './OutputConnection';
import { DFlipFlop, TFlipFlop, JKFlipFlop } from './MSIGates';

export interface IClockable {
  Tick(): void;
}

export function isClockable(arg: LogicGate) : boolean {
  return arg["Tick"] !== undefined;
}

/**Base class that contains the main functionality of all logic gates. */
export class LogicGate {
  type: string = "LogicGate";
  IsFilled: boolean;
  InputCount: number;
  Name: string;
  Output: boolean;
  InputNameMap: Map<string, number>;

  constructor(name: string, inputCount: number, inputNames: string[]) {
    this.InputCount = inputCount;
    this.Name = name;
    this.InputNameMap = new Map<string, number>();

    if (inputNames.length > 0) {
      for (let i = 0; i < inputNames.length; i++) {
        this.InputNameMap.set(inputNames[i], i + 1);
      }
    }
  }

  public GetIndexForInputName(inputName: string): number {
    if (this.InputNameMap.has(inputName)) {
      return this.InputNameMap[inputName];
    }
    else {
      return -1; // Flag to make communication between the F# and C# code easier.
    }
  }

  public GetOutput(): boolean {
    if (!this.IsFilled)
      throw new Error(`Gate ${this.Name} is not connected`);
    else
      return this.Output;
  }

  protected SetOutput = (output: boolean) => this.Output = output;

  public Activate(inputSide: number, input: boolean): void {
    throw new Error("Activate for LogicGate is not defined"); // All LogicGates have an "Activate" method, but this cannot be abstract because it is implemented 2 classes down.
  }
}

/** Base class that contains the functionality for all gates with a single output. */
export class SingleOutputGate extends LogicGate {
  type: string = "SingleOutputGate";
  ConnectedGates: OutputConnection[];

  constructor(name: string, inputCount: number, inputNames: string[]) {
    super(name, inputCount, inputNames);
    this.ConnectedGates = [];
  }

  public AddConnection(outputConnection: OutputConnection): void {
    this.ConnectedGates.push(outputConnection);
  }
}

/** Base class that contains the functionality for all gates that have multiple outputs. */
export class MultipleOutputGate extends LogicGate {
  type: string = "MultipleOutputGate";
  OutputMap: OutputConnection[][];
  OutputNameMap: Map<string, number>

  constructor(name: string, inputCount: number, outputCount: number, inputNameList: string[], outputNameMap: Map<string, number>) {
    super(name, inputCount, inputNameList);

    // Set output map to be a 2D array.
    this.OutputMap = [];
    for (let i = 0; i < outputCount; i++) {
      this.OutputMap.push([]);
    }


    this.OutputNameMap = outputNameMap;
  }

  public AddConnectionTo(outputConnection: OutputConnection, output: number): void {
    console.log("Adding");
    console.log(outputConnection);
    console.log(`to ${this.Name}`);
    console.log(this.OutputMap);
    this.OutputMap[output].push(outputConnection); // outputs 0 indexed.
  }

  public GetIndexForOutputName(inputName: string): number {
    if (this.OutputNameMap.has(inputName)) {
      return this.OutputNameMap[inputName];
    }
    else {
      return -1; // Flag to make communication between the F# and C# code easier.
    }
  }
}
