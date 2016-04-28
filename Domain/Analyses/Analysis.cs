using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SS.BL.Domain.Users;

namespace SS.BL.Domain.Analyses
{
    public class Analysis
    {
        [Key]
        public long Id { get; set; }
        [Index(IsUnique = true), MaxLength(450)]
        public string Name { get; set; }
        public int NumberOfSolvents { get; set; }
        public DateTime DateCreated { get; set; }
        public User CreatedBy { get; set; }
        public Organisation SharedWith { get; set; }
        public List<AnalysisModel> AnalysisModels { get; set; }
    }
}
