using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analyses
{
    public class EHSScore
    {
        [Key]
        public String CasNumber { get; set; }
        public int EhsHScore { get; set; }
        public int EhsEScore { get; set; }
        public int EhsSScore { get; set; }
        public String EhsColorCode { get; set; }
        public int EhsFinalScore { get; set; }
    }
}