import { Component, OnInit } from '@angular/core';
import { LogicGate, IClockable, isClockable } from '../../LogicGateDomain/BaseClasses';
import { UnaryCanonicalGates } from '../../LogicGateDomain/UnaryGates';
import { Array } from '../extensions/Array';
import { jsonToCircuit } from '../../LogicGateDomain/ParseJson';
import { DFlipFlop, TFlipFlop, JKFlipFlop } from '../../LogicGateDomain/MSIGates';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  styleUrls: ['./execute.component.css']
})
export class ExecuteComponent implements OnInit {

  inputs: number = 0;
  inputSet: UnaryCanonicalGates.InputGate[] = [];
  outputs: number = 0;
  outputSet: UnaryCanonicalGates.OutputGate[] = [];
  clockableSet: LogicGate[] = [];
  circuit: LogicGate[] = null;
  circuitString: string = "";

  errorMessage: string = "";

  constructor() { }

  ngOnInit() {
  }

  error(error: any) {
    this.errorMessage = "Error:\n" + JSON.stringify(error);
  }

  run(circuit: LogicGate[]) {

    // Clear the error message on a successful run.
    this.errorMessage = "";

    console.log("Received: \n" + JSON.stringify(circuit));

    this.circuit = jsonToCircuit(circuit);
    console.log(JSON.stringify(this.circuit));

    this.circuitString = JSON.stringify(this.circuit);
    this.inputs = Array.countBy(this.circuit, l => l.type === "InputGate");
    this.outputs = Array.countBy(this.circuit, l => l.type === "OutputGate");
    this.clockableSet = this.circuit.filter(l => isClockable(l));

    if (this.clockableSet === undefined || this.clockableSet === null) {
      this.clockableSet = [];
    }

    console.log(this.inputs + " " + this.outputs);
    this.inputSet = this.getInputs();
    this.outputSet = this.getOutputs();

    if (this.clockableSet.length > 0) {
      this.clock();
    }

    // Start the circuit with all zeroes to update the outputs.
    this.fireZeros();
  }

  clock() {
    this.clockableSet.forEach(l => {
      if (l instanceof DFlipFlop || l instanceof JKFlipFlop || l instanceof TFlipFlop) {
        l.Tick();
      }
      
    });

    window.setTimeout(this.clock, 1000);
  }

  fireZeros() {
    this.inputSet.forEach(i => i.Fire());
  }

  // An input is clicked, toggle the input gate's output. This will also toggle the display's color using [ngClass].
  inputClick(index: number) {
    console.log(`Input ${index} clicked`);
    this.inputSet[index].SetInputAndFire(!this.inputSet[index].Input);
  }


  getInputs(): UnaryCanonicalGates.InputGate[] {
    return <UnaryCanonicalGates.InputGate[]>this.circuit.filter(l => l.type === "InputGate");
  }

  getOutputs(): UnaryCanonicalGates.OutputGate[] {
    return <UnaryCanonicalGates.OutputGate[]>this.circuit.filter(l => l.type === "OutputGate");
  }

}
