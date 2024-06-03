﻿using static c__components.Model.GetPageList;

namespace c__components.Model
{
    public static class CustomerActionResult
    {
        public static FormatResultModel<T> FormatResult<T>(this T t)
        {
            return new FormatResultModel<T>(t, true, string.Empty);
        }

        public static FormatResultModel<T> FormatResult<T>(this T t, string message)
        {
            return new FormatResultModel<T>(t, false, message);
        }
    }
}
