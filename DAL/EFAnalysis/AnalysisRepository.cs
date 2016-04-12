using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.DAL.EFAnalysis
{
    public class AnalysisRepository : IAnalysisRepository
    {
        private readonly EFDbContext context;

        public AnalysisRepository()
        {
            this.context = new EFDbContext();
        }
    }
}
