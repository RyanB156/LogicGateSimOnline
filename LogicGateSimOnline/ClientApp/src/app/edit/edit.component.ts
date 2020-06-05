import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogicGate } from '../../LogicGateDomain/BaseClasses';
import { ActivatedRoute } from '@angular/router';
import { ExecuteComponent } from '../execute/execute.component';

/* Next:
     *  Test project linking with api and postman √
     *  Test api call from here to circuit controller √
     *  Get LogicGate[] and display inputs and outputs (May need to have full TS classes for logic gates?) √
     *  Test button linking to inputs (list of buttons created -> call w/ index) √
     *  Test usage of circuit
     *
     *  !!! Fix nulls in parsed circuit !!!
     *
     *  Add Text property to C# classes for mapping to typescript classes √
     *  Clock to cycle the flipflops
*/


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @ViewChild(ExecuteComponent) executeArea: ExecuteComponent;

  // Store a list of available programs.
  programSet: string[] = [`
// 1
Input in1
Input in2
Output out

define and(a, b : A)
{
    temp <- a.b;
    A <- temp;
}

and(mygate)

in1 :- mygate, a
in2 :- mygate, b
mygate.A :- out
`, `
// 2
Input in1
Input in2
Decoder2 dec
Output out1
Output out2
Output out3
Output out4

in1 :- dec, 1
in2 :- dec, 2
dec.0 :- out1
dec.1 :- out2
dec.2 :- out3
dec.3 :- out4
`, `
// 3
Input x
Input y
Xor2 x1
Xor2 x2
DFlipFlop f
Output out

x :- x1, 1
y :- x1, 2
x1 :- x2, 2
f.0 :- x2, 1
x2 :- f
f.0 :- out
`, `
// 4
Input x
Input y
Xor2 x1
Output out

x :- x1, 1
y :- x1, 2
x1 :- out
`
  ];
  program: string;
  baseUrl: string;
  http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private route: ActivatedRoute) {
    this.baseUrl = baseUrl;
    this.http = http;

    this.route.params.subscribe(params => {

      // If the id parameter is set and is a valid number.
      if (params['id'] && +params['id'] !== NaN) {
        let id = params['id'];
        // If the id has a matching program.
        if (id >= 1 && id - 1 < this.programSet.length) {
          this.program = this.programSet[id - 1];
        }
      }
    });
  }

  ngOnInit() {
  }

  run() {
    console.log("Running Program: \n" + this.program);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    this.http.post<LogicGate[]>(this.baseUrl + 'api/circuit/buildcircuit', new CircuitProgram(this.program), httpOptions)
      .subscribe({
        next: data => this.executeArea.run(data),
        error: error => this.executeArea.error(error)
      });

  }

}

class CircuitProgram {
  Text: string;

  constructor(text) {
    this.Text = text;
  }
}



