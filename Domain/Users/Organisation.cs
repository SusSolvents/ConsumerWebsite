﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Users
{
    public class Organisation
    {
        [Key]
        public long Id { get; set; }
        [Index(IsUnique = true)]
        [MaxLength(100)]
        public string Name { get; set; }
        public string LogoUrl { get; set; }
        public bool Blocked { get; set; }
        public DateTime? DateCreated { get; set; }
        public long OrganisatorId { get; set; }
    }
}
