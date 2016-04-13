using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public string Name { get; set; }
        public DateTime DateCreated { get; set; }
        public string SourcefileUrl { get; set; }
        public User CreatedBy { get; set; }
        public Organisation SharedWith { get; set; }
        public ICollection<Analysis> Analyses { get; set; }
        public ICollection<Algorithm> UsedAlgorithms { get; set; }
    }
}
