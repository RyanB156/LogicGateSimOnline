import { Component, OnInit } from '@angular/core';
import { LogicGate, InputGate, OutputGate } from '../../LogicGateDomain/Domain';
import { Array } from '../extensions/Array';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.component.html',
  styleUrls: ['./execute.component.css']
})
export class ExecuteComponent implements OnInit {

  inputs: number = 0;
  inputSet: InputGate[] = [];
  outputs: number = 0;
  outputSet: OutputGate[] = [];
  circuit: LogicGate[] = null;
  circuitString: string = "";

  constructor() { }

  ngOnInit() {
  }

  run(circuit: LogicGate[]) {
    this.circuit = circuit;
    this.circuitString = JSON.stringify(circuit);
    this.inputs = Array.countBy(circuit, l => l.type === "InputGate");
    this.outputs = Array.countBy(circuit, l => l.type === "OutputGate");

    //circuit.forEach(l => console.log(l.type));

    console.log(this.inputs + " " + this.outputs);
    this.inputSet = this.getInputs();
    this.outputSet = this.getOutputs();
  }

  inputClick(index: number) {
    console.log(`Input ${index} clicked`);
    this.inputSet[index].Output = !this.inputSet[index].Output; // TODO: Change to class method call once I translate all of them...
  }

  getInputs() : InputGate[] {
    return <InputGate[]>this.circuit.filter(l => l.type === "InputGate");
  }

  getOutputs(): OutputGate[] {
    return <OutputGate[]>this.circuit.filter(l => l.type === "OutputGate");
  }

}
