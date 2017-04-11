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
        public string CasNumber { get; set; }
        public string IDName { get; set; }
        public string Source { get; set; }
        public string EGNr { get; set; }
        public string EGAnnexNr { get; set; }
        public int EhsHScore { get; set; }
        public int EhsEScore { get; set; }
        public int EhsSScore { get; set; }
        public string EhsColorCode { get; set; }
        public double BoilingPoint { get; set; }
        public double MeltingPoint { get; set; }
        public double VapourPress { get; set; }
        public double FlashPoint { get; set; }
        public double Autoignition { get; set; }
        public double HansenDeltaD { get; set; }
        public double HansenDeltaP { get; set; }
        public double HansenDeltaH { get; set; }
        public double SolubilityWater { get; set; }
        public double Density { get; set; }
        public double Viscosity { get; set; }
        public double RelativeVapDen { get; set; }
        public double LogPOctanol { get; set; }
        public double RefractiveIndex { get; set; }
        public double SurfaceTension { get; set; }
        public int EhsFinalScore { get; set; }
    }
}