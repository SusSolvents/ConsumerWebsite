﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analysis
{
    public class Algorithm
    {
        public long Id { get; set; }
        public AlgorithmName AlgorithmName { get; set; }
        public long ProcessTime { get; set; }
        public string GeneralResult { get; set; }
    }
}
