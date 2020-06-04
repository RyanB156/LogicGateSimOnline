import { Component, OnInit } from '@angular/core';
import { LogicGate } from '../../LogicGateDomain/BaseClasses';
import { UnaryCanonicalGates } from '../../LogicGateDomain/UnaryGates';
import { Array } from '../extensions/Array';
import { jsonToCircuit } from '../../LogicGateDomain/ParseJson';
import { CustomGate } from '../../LogicGateDomain/CustomGate';

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
  circuit: LogicGate[] = null;
  circuitString: string = "";

  constructor() { }

  ngOnInit() {
  }

  run(circuit: LogicGate[]) {

    circuit = jsonToCircuit(circuit);
    console.log(JSON.stringify(circuit));

    this.circuit = circuit;
    this.circuitString = JSON.stringify(circuit);
    this.inputs = Array.countBy(circuit, l => l.type === "InputGate");
    this.outputs = Array.countBy(circuit, l => l.type === "OutputGate");

    //circuit.forEach(l => console.log(l.type));

    console.log(this.inputs + " " + this.outputs);
    this.inputSet = this.getInputs();
    this.outputSet = this.getOutputs();

    // Start the circuit with all zeroes to update the outputs.
    this.fireZeros();
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
