using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analyses
{
    public class SolventMetaData
    {
        public string Label { get; set; }
        public string Input { get; set; }
        [DisplayName("ID_Name_1")]
        public string IdName1 { get; set; }
        [DisplayName("ID_CAS_Nr_1")]
        public string IdCasNr { get; set; }
        [DisplayName("ID_EG_Nr")]
        public string IdEgNr { get; set; }
        [DisplayName("ID_EG_Annex_Nr")]
        public string IdEgAnnexNr { get; set; }
    }
}
