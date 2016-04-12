﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.User
{
    public class Organisation
    {
        [Key]
        public long Id { get; set; }
        public string name { get; set; }
        public string LogoUrl { get; set; }
    }
}
