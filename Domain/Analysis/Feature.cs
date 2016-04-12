﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analysis
{
    public class Feature
    {
        [Key]
        public long Id { get; set; }
        public FeatureName FeatureName { get; set; }
        public double Value { get; set; } 
    }
}
