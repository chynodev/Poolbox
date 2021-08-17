using System.Collections.Generic;
using System.Linq;
using OfficeOpenXml;

namespace PoolBox.Web.Modules.Common.Helpers
{
    public static class ExcelPackage
    {
        public static IEnumerable<object> GetRows(this ExcelWorksheet worksheet)
        {
            var start = worksheet.Dimension.Start;
            var end = worksheet.Dimension.End;
            for (int row = start.Row; row <= end.Row; row++)
            {
                yield return worksheet.Cells
                    .ToDictionary(x => worksheet.Cells[row, start.Column, row, end.Column]);
            }
        }
    }
}
