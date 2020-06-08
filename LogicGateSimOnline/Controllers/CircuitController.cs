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
        public IActionResult BuildCircuit([FromBody]CircuitProgram program)
        {
            try
            {
                var statements = FCircuitParser.Parser.getProgramFromString(program.Text);
                var circuit = FCircuitParser.Parser.getCircuit(statements);
                return Ok(circuit);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        public class CircuitProgram
        {
            public string Text { get; set; }
        }
        
    }
}
