import { LogicGate } from './BaseClasses';

export class OutputConnection {
  TargetGate: LogicGate;
  InputNode: number;

  constructor(targetGate: LogicGate, inputNode: number) {
    this.TargetGate = targetGate;
    this.InputNode = inputNode;
  }
}
