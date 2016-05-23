using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SS.BL.Domain.Analyses
{
    public enum FeatureName
    {
        Boiling_Point_Minimum_DegreesC,
        Melting_Point_Minimum_DegreesC,
        Flash_Point_Minimum_DegreesC,
        Vapour_Pressure_25DegreesC_mmHg,
        Density_25DegreesC_Minimum_kg_L,
        Viscosity_25DegreesC_Minimum_mPa_s,
        Autoignition_Temperature_Minimum_DegreesC,
        Hansen_Delta_D_MPa1_2,
        Hansen_Delta_P_MPa1_2,
        Hansen_Delta_H_MPa1_2,
        Solubility_Water_g_L,
        Dielectric_Constant_20DegreesC,
        Hildebrandt_Par_MPa1_2
    }
}
