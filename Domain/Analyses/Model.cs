using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analyses
{
    public class Model
    {
        public long Id { get; set; }
        public string DataSet { get; set; }
        public DateTime Date { get; set; }
        public ICollection<Cluster> Clusters { get; set; }
    }
}
