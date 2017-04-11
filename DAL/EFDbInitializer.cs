using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SS.BL.Domain.Users;
using SS.BL.Domain.Analyses;
using System.IO;

namespace SS.DAL
{
    public class EFDbInitializer : DropCreateDatabaseAlways<EFDbContext>
    {
        protected override void Seed(EFDbContext context)
        {
            //Create Min & Max values for features
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Boiling_Point_Minimum_DegreesC,
                MinValue = -150,
                MaxValue = 500,
               
                Regex = @"^-?\d{0,3}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Melting_Point_Minimum_DegreesC,
                MinValue = -200,
                MaxValue = 20,
                
                Regex = @"^-?\d{0,3}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Flash_Point_Minimum_DegreesC,
                MinValue = -85,
                MaxValue = 360,
                
                Regex = @"^-?\d{0,3}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Vapour_Pressure_25DegreesC_mmHg,
                MinValue = 0,
                MaxValue = 24500,
                
                Regex = @"^\d{1,5}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Density_25DegreesC_Minimum_kg_L,
                MinValue = 0.6,
                MaxValue = 3.5,
                
                Regex = @"^\d{1}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Viscosity_25DegreesC_Minimum_mPa_s,
                MinValue = 0.01,
                MaxValue = 1000,
                
                Regex = @"^\d{1,4}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Autoignition_Temperature_Minimum_DegreesC,
                MinValue = 100,
                MaxValue = 800,
               
                Regex = @"^\d{1,3}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Hansen_Delta_D_MPa1_2,
                MinValue = 0,
                MaxValue = 30,
                
                Regex = @"^\d{1,2}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Hansen_Delta_P_MPa1_2,
                MinValue = 0,
                MaxValue = 30,
                
                Regex = @"^\d{1,2}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Hansen_Delta_H_MPa1_2,
                MinValue = 0,
                MaxValue = 50,
                
                Regex = @"^\d{1,2}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Solubility_Water_g_L,
                MinValue = -1,
                MaxValue = 1000,
                
                Regex = @"^-?\d{0,4}(\.\d{0,5})?$"
            });
            context.MinMaxValues.Add(new MinMaxValue()
            {
                FeatureName = FeatureName.Dielectric_Constant_20DegreesC,
                MinValue = 1,
                MaxValue = 100,
                
                Regex = @"^\d{1,3}(\.\d{0,5})?$"
            });

<<<<<<< HEAD
            var Lines = SS.DAL.Properties.Resources.datasetqframe.ToString().Split('\n');
=======
            var Lines = File.ReadLines("C:\\Users\\Christophe\\Desktop\\ConsumerWebsite-master\\ConsumerWebsite-master\\UI-MVC\\Database stage 2017 csv.csv").Select(a => a.Split('\n'));
>>>>>>> 2089f2898ccdbe7ce5d237708d018325d45ed171


            foreach (var line in Lines.Skip(2))
            {
<<<<<<< HEAD
                if (line.ToString() == null || line.ToString() == "")
                {
                    break;
                }
                
                    string[] result = line.ToString().Split(';');
                    context.EHSScores.Add(new EHSScore()
                    {
                        Source = result.ElementAt(0).ToString(),
                        CasNumber = result.ElementAt(2).ToString(),
                        IDName = result.ElementAt(1).ToString(),
                        EGNr = result.ElementAt(3).ToString(),
                        EGAnnexNr = result.ElementAt(4).ToString(),
                        EhsSScore = Int32.Parse(result.ElementAt(5)),
                        EhsHScore = Int32.Parse(result.ElementAt(6)),
                        EhsEScore = Int32.Parse(result.ElementAt(7)),
                        EhsColorCode = result.ElementAt(8).ToString(),
                        BoilingPoint = Convert.ToDouble(result.ElementAt(9)),
                        MeltingPoint = Convert.ToDouble(result.ElementAt(10)),
                        VapourPress = Convert.ToDouble(result.ElementAt(11)),
                        FlashPoint = Convert.ToDouble(result.ElementAt(12)),
                        Autoignition = Convert.ToDouble(result.ElementAt(13)),
                        HansenDeltaD = Convert.ToDouble(result.ElementAt(14)),
                        HansenDeltaP = Convert.ToDouble(result.ElementAt(15)),
                        HansenDeltaH = Convert.ToDouble(result.ElementAt(16)),
                        SolubilityWater = Convert.ToDouble(result.ElementAt(17)),
                        Density = Convert.ToDouble(result.ElementAt(18)),
                        Viscosity = Convert.ToDouble(result.ElementAt(19)),
                        RelativeVapDen = Convert.ToDouble(result.ElementAt(20)),
                        LogPOctanol = Convert.ToDouble(result.ElementAt(21)),
                        RefractiveIndex = Convert.ToDouble(result.ElementAt(22)),
                        SurfaceTension = Convert.ToDouble(result.ElementAt(23))


                    });
                


=======

                string woord = line.ElementAt(0).ToString();
                string[] result = woord.Split(';');
                System.Diagnostics.Debug.WriteLine(result.ElementAt(5));
                context.EHSScores.Add(new EHSScore()
                {

                    CasNumber = result.ElementAt(2).ToString(),
                    EhsSScore = Int32.Parse(result.ElementAt(5)),
                    EhsHScore = Int32.Parse(result.ElementAt(6)),
                    EhsEScore = Int32.Parse(result.ElementAt(7)),
                    EhsColorCode = result.ElementAt(8).ToString()

                });
>>>>>>> 2089f2898ccdbe7ce5d237708d018325d45ed171



            }
<<<<<<< HEAD


            //change
=======
>>>>>>> 2089f2898ccdbe7ce5d237708d018325d45ed171

            context.SaveChanges();
        }

    }
}
