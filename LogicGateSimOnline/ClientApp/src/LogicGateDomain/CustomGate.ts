import { MultipleOutputGate } from './BaseClasses';

/** Custom gates that can have any number of inputs and outputs as defined by the user's gate definition. */
export class CustomGate extends MultipleOutputGate {
  type: string = "CustomGate";
  Outputs: boolean[];
  OutputCount: number;
  OutputFunctions: Map<number, boolean>[];
  Inputs: boolean[];
  AreInputsUpdated: boolean[];

  constructor(name: string, inputCount: number, outputCount: number, inputNameList: string[],
    outputNameMap: Map<string, number>, outputFunctions: Map<number, boolean>[]) {
    super(name, inputCount, outputCount, inputNameList, outputNameMap);
    this.Outputs = new Array(outputCount).fill(false);
    this.OutputCount = outputCount;
    this.Inputs = new Array(inputCount).fill(false);
    this.AreInputsUpdated = new Array(inputCount).fill(false);
    this.OutputFunctions = outputFunctions;
  }

  static MintermDigit(arr: boolean[]): number {
    let ret = 0;
    for (let i = 0; i < arr.length; i++) {
      ret *= 2;
      ret += arr[i] ? 1 : 0;
    }
    return ret;
  }

  // Update outputs based on the truth tables in "outputFunctions".
  private UpdateOutputs(): void {
    for (let i = 0; i < this.OutputFunctions.length; i++) {
      this.Outputs[i] = this.OutputFunctions[i][CustomGate.MintermDigit(this.Inputs)];
    }
  }

  private SendOutput(): void {
    for (let i = 0; i < this.OutputCount; i++) {
      this.OutputMap[i].forEach(c => {
        c.TargetGate.Activate(c.InputNode, this.Outputs[i]);
      })

    }
  }

  public Activate(inputSide: number, input: boolean): void {
    this.Inputs[inputSide - 1] = input;
    this.AreInputsUpdated[inputSide - 1] = true;

    // If all of the inputs have been activated update the outputs and send output.
    if (this.AreInputsUpdated.every(x => x)) {
      this.IsFilled = true;
      this.UpdateOutputs();
      this.SendOutput();
    }
  }

}
