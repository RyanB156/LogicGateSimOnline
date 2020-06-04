
import { LogicGate, MultipleOutputGate, SingleOutputGate } from './BaseClasses';
import { CustomGate } from './CustomGate';
import { NDecoder, Multiplexer, TFlipFlop, JKFlipFlop, DFlipFlop } from './MSIGates';
import { NaryGate, NaryCanonicalGates } from './NaryGates';
import { OutputConnection } from './OutputConnection';
import { UnaryGate, UnaryCanonicalGates } from './UnaryGates';


function parseGate(json: object): LogicGate {

  console.log(`parseGate - creating ${json["type"]}`);
  console.log(json);

  /*
   * these are null:
   *  outputs, inputs, areinputsupdated
   */

  switch (json["type"]) {
    case "AndGate": return new NaryCanonicalGates.AndGate(json["name"], json["inputCount"], json["nameList"]);
    case "OrGate": return new NaryCanonicalGates.OrGate(json["name"], json["inputCount"], json["nameList"]); 
    case "XorGate": return new NaryCanonicalGates.XorGate(json["name"], json["inputCount"], json["nameList"]);
    case "XnorGate": return new NaryCanonicalGates.AndGate(json["name"], json["inputCount"], json["nameList"]);
    case "NandGate": return new NaryCanonicalGates.AndGate(json["name"], json["inputCount"], json["nameList"]);
    case "NorGate": return new NaryCanonicalGates.AndGate(json["name"], json["inputCount"], json["nameList"]);
    case "NotGate": return new UnaryCanonicalGates.NotGate(json["name"]);
    case "InputGate": return new UnaryCanonicalGates.InputGate(json["name"], json["input"]);
    case "OutputGate": return new UnaryCanonicalGates.OutputGate(json["name"]);
    case "IdentityGate": return new UnaryCanonicalGates.IdentityGate(json["name"]);
    case "TrueGate": return new UnaryCanonicalGates.TrueGate(json["name"]);
    case "FalseGate": return new UnaryCanonicalGates.FalseGate(json["name"]);
    case "Decoder": return new NDecoder(json["name"], json["inputCount"], json["inputNameMap"], json["outputNameMap"]);
    case "Multiplexer": return new Multiplexer(json["name"], json["inputCount"], json["inputNameMap"]);
    case "DFlipFlop": return new DFlipFlop(json["name"], json["outputNameMap"]);
    case "TFlipFlop": return new TFlipFlop(json["name"], json["outputNameMap"]);
    case "JKFlipFlop": return new JKFlipFlop(json["name"], json["inputCount"], json["inputNameMap"], json["outputNameMap"]);
    case "CustomGate": return new CustomGate(json["name"], json["inputCount"], json["outputCount"], json["inputNameMap"],
      json["outputNameMap"], json["outputFunctions"]);
  }
}

function connectGates(circuit: LogicGate[], jsonObject: object[]) : void {
  circuit.forEach(lG => {
    console.log(`connectGates - Connecting outputs for gate ${lG.Name}`);
    // Find the logic gate in the json object to access its connection list.
    let o = jsonObject.find(jO => jO["name"] === lG.Name);
    if (o === undefined) {
      console.log(`ERROR: Could not find gate ${lG.Name} in json object to start connecting`);
    } else {
      // Gates with a "connectedGates" field have one output to map to other gates.
      if (o["connectedGates"]) {
        console.log(`connectGates - ${lG.Name} has an output map`);
        o["connectedGates"].forEach(cG => { // Get of the json objects for the output.
          let targetGate = circuit.find(c => c.Name === cG["targetGate"]["name"]); // Use name to get circuit object.
          if (targetGate) {
            console.log(`connectGates.cG - Connecting gate ${lG.Name} to target gate ${targetGate.Name} on node ${cG["inputNode"]}`);
            (<SingleOutputGate>lG).AddConnection(new OutputConnection(targetGate, cG["inputNode"]));
          } else {
            console.log(`connectedGates - ERROR: Could not find gate ${cG["targetGate"]["name"]} for gate ${lG.Name} to connect to`);
          }
        });
        // Gates with an "outputMap" field have multiple outputs to map to other gates.
      } else if (o["outputMap"]) {
        console.log(`connectGates - ${lG.Name} has an output map`);
        o["outputMap"].forEach((output, ndx) => { // Get each output.
          output.forEach(cG => { // Get name of the json objects for each output.
            let targetGate = circuit.find(c => c.Name === cG["targetGate"]["name"]);
            if (targetGate) {
              console.log(`connectGates.oM - Connecting gate ${lG.Name} to target gate ${targetGate.Name} on node ${cG["inputNode"]}`);
              (<MultipleOutputGate>lG).AddConnectionTo(new OutputConnection(targetGate, cG["inputNode"]), ndx);
            } else {
              console.log(`outputMap - ERROR: Could not find gate ${cG["targetGate"]["name"]} in output ${ndx} for gate ${lG.Name} to connect to`);
            }
          });
        });
      } else {
        console.log(`ERROR: Could not find output mappings for gate ${lG.Name}`);
      }
    }
  });
}

/*
 * OutputConnections must be made to the same object of each gate. This means that each gate must be connected first, then they will be connected.
 */

export function jsonToCircuit(jsonObject: object[]): LogicGate[] {
  console.log("jsonToCircuit - parsing to circuit");
  let circuit = jsonObject.map(parseGate);

  console.log("jsonToCircuit - connecting gates");
  connectGates(circuit, jsonObject);

  return circuit;
}
