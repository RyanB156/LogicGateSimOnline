using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LogicGateDomain;
using FCircuitParser;

namespace LogicGateSimOnline.Controllers
{
    [Route("api/[controller]")]
    public class CircuitController : Controller
    {
        [HttpPost("[action]")]
        public IEnumerable<LogicGate> BuildCircuit([FromBody]CircuitProgram program)
        {
            var statements = FCircuitParser.Parser.getProgramFromString(program.Text);
            var circuit = FCircuitParser.Parser.getCircuit(statements);
            return circuit;
        }

        public class CircuitProgram
        {
            public string Text { get; set; }
        }
        
    }
}
