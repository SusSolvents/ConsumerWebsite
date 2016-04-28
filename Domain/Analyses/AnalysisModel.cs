using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analyses
{
    public class AnalysisModel
    {
        [Key]
        public long Id { get; set; }
        public Model Model { get; set; }
    }
}
