﻿using SS.BL.Domain.Analyses;
using SS.BL.Domain.Users;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.DAL
{
    public class EFDbContext : DbContext
    {
        public EFDbContext() : base("sussol")
        {
            Database.SetInitializer<EFDbContext>(new EFDbInitializer());
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Organisation> Organisations { get; set; }
        public DbSet<OrganisationMember> OrganisationMembers { get; set; }
        public DbSet<Algorithm> Algorithms { get; set; }
        public DbSet<Analysis> Analyses { get; set; }
        public DbSet<Cluster> Clusters { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Parameter> Parameters { get; set; }
        public DbSet<Solvent> Solvents { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}