using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analysis
{
    public class Solvent
    {
        [Key]
        public long Id { get; set; }
        public int Number { get; set; }
        public string Name { get; set; }
        public string CasNr { get; set; }
        public double DistanceToClusterCenter { get; set; }
    }
}
