using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SS.BL.Domain.Users;
using SS.BL.Domain.Analyses;

namespace SS.DAL
{
    public class EFDbInitializer : DropCreateDatabaseIfModelChanges<EFDbContext>
    {
        protected override void Seed(EFDbContext context)
        {
            //Create Min & Max values for features
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Boiling_Point_Minimum_DegreesC,
                MinValue = -150,
                MaxValue = 500,
                StepValue = 20
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Melting_Point_Minimum_DegreesC,
                MinValue = -200,
                MaxValue = 20,
                StepValue = 5
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Flash_Point_Minimum_DegreesC,
                MinValue = -85,
                MaxValue = 360,
                StepValue = 15
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Vapour_Pressure_25DegreesC_mmHg,
                MinValue = 0,
                MaxValue = 24500,
                StepValue = 100
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Density_25DegreesC_Minimum_kg_L,
                MinValue = 0.6,
                MaxValue = 3.5,
                StepValue = 0.1
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Viscosity_25DegreesC_Minimum_mPa_s,
                MinValue = 0.01,
                MaxValue = 1000,
                StepValue = 10
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Autoignition_Temperature_Minimum_DegreesC,
                MinValue = 100,
                MaxValue = 800,
                StepValue = 20
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Hansen_Delta_D_MPa1_2,
                MinValue = 0,
                MaxValue = 30,
                StepValue = 1
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Hansen_Delta_P_MPa1_2,
                MinValue = 0,
                MaxValue = 30,
                StepValue = 1
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Hansen_Delta_H_MPa1_2,
                MinValue = 0,
                MaxValue = 50,
                StepValue = 2
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Solubility_Water_g_L,
                MinValue = -1,
                MaxValue = 1000,
                StepValue = 20
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Dielectric_Constant_20DegreesC,
                MinValue = 1,
                MaxValue = 100,
                StepValue = 2
            });
            context.SaveChanges();
        }

    }
}
