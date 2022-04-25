/**
 * Copyright 2017-2022 Plexus Interop Deutsche Bank AG
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
namespace Plexus
{
    using System.Collections.Generic;
    using System.Linq;

    internal static class FormattingUtils
    {
        public static string FormatEnumerableObjects<T>(this IEnumerable<T> enumerable)
        {
            return enumerable == null ? string.Empty : $"[{string.Join(", ", enumerable.Select(FormatObject))}]";
        }

        public static string FormatEnumerable<T>(this IEnumerable<T> enumerable)
        {
            return enumerable == null ? string.Empty : $"[{string.Join(", ", enumerable)}]";
        }

        public static string FormatObject<T>(this T obj)
        {
            return $"{{{obj}}}";
        }
    }
}
