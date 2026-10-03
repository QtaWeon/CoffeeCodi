import React from 'react';

/**
 * Skeleton Loader for Inicio View
 */
export const InicioSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-8 animate-pulse">
      {/* Saludo Header Skeleton */}
      <div className="px-4 pt-3 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-32 rounded-full bg-[#ede7e3] dark:bg-[#281b15]"></div>
          <div className="h-4 w-20 rounded-full bg-[#ede7e3] dark:bg-[#281b15]"></div>
        </div>
        <div className="h-7 w-52 rounded-lg bg-[#ede7e3] dark:bg-[#281b15] mt-0.5"></div>
        <div className="h-4 w-4/5 rounded-md bg-[#ede7e3] dark:bg-[#281b15]"></div>
      </div>

      {/* Hero Card Skeleton */}
      <div className="px-4 py-2">
        <div className="rounded-2xl bg-[#ede7e3] dark:bg-[#201511] p-4 flex flex-col gap-3 min-h-[200px] border border-transparent dark:border-[#382820]">
          <div className="flex items-center justify-between">
            <div className="h-6 w-36 rounded-full bg-[#d3c3be] dark:bg-[#34241d]"></div>
            <div className="h-4 w-24 rounded-full bg-[#d3c3be] dark:bg-[#34241d]"></div>
          </div>
          <div className="h-6 w-3/4 rounded-lg bg-[#d3c3be] dark:bg-[#34241d] mt-1"></div>
          <div className="h-4 w-full rounded-md bg-[#d3c3be] dark:bg-[#34241d]"></div>
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-20 rounded-md bg-[#d3c3be] dark:bg-[#34241d]"></div>
            <div className="h-5 w-24 rounded-md bg-[#d3c3be] dark:bg-[#34241d]"></div>
            <div className="h-5 w-20 rounded-md bg-[#d3c3be] dark:bg-[#34241d]"></div>
          </div>
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="h-6 w-24 rounded-md bg-[#d3c3be] dark:bg-[#34241d]"></div>
            <div className="h-9 w-28 rounded-xl bg-[#d3c3be] dark:bg-[#34241d]"></div>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll Skeleton */}
      <div className="py-2.5 flex flex-col gap-2">
        <div className="px-4 flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
          <div className="h-3 w-24 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
        </div>
        <div className="flex gap-2.5 overflow-x-auto px-4 no-scrollbar py-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 h-10 w-28 rounded-xl bg-[#ede7e3] dark:bg-[#201511]"
            ></div>
          ))}
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="px-4 py-2">
        <div className="rounded-2xl bg-[#ede7e3] dark:bg-[#201511] p-4 flex flex-col gap-2.5 min-h-[110px] border border-transparent dark:border-[#382820]">
          <div className="h-4 w-40 rounded bg-[#d3c3be] dark:bg-[#34241d]"></div>
          <div className="h-5 w-52 rounded bg-[#d3c3be] dark:bg-[#34241d]"></div>
          <div className="h-8 w-full rounded-xl bg-[#d3c3be] dark:bg-[#34241d] mt-1"></div>
        </div>
      </div>

      {/* Bestsellers List Skeleton */}
      <div className="px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-44 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
          <div className="h-4 w-24 rounded-full bg-[#ede7e3] dark:bg-[#281b15]"></div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-white dark:bg-[#1c1410] border border-[#e8e1d9] dark:border-[#342721] flex gap-3 items-center"
            >
              <div className="w-20 h-20 rounded-xl bg-[#ede7e3] dark:bg-[#281b15] flex-shrink-0"></div>
              <div className="flex-1 flex flex-col justify-between h-20 py-1">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-4 w-32 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
                    <div className="h-4 w-16 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
                  </div>
                  <div className="h-3 w-44 rounded bg-[#ede7e3] dark:bg-[#281b15] mt-1.5"></div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="h-3 w-20 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
                  <div className="w-7 h-7 rounded-lg bg-[#ede7e3] dark:bg-[#281b15]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Menu View
 */
export const MenuSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-8 animate-pulse">
      {/* Search Header Skeleton */}
      <div className="px-4 pt-3 pb-1 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-11 rounded-xl bg-[#ede7e3] dark:bg-[#201511]"></div>
          <div className="w-11 h-11 rounded-xl bg-[#ede7e3] dark:bg-[#201511]"></div>
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="h-4 w-32 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
          <div className="h-4 w-28 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
        </div>
      </div>

      {/* Category Pills Horizontal Scroll Skeleton */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 px-4 flex items-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 h-8 w-24 rounded-full bg-[#ede7e3] dark:bg-[#201511]"
          ></div>
        ))}
      </div>

      {/* Dietary Pills Horizontal Scroll Skeleton */}
      <div className="w-full overflow-x-auto no-scrollbar py-1 px-4 flex items-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 h-7 w-28 rounded-lg bg-[#ede7e3] dark:bg-[#201511]"
          ></div>
        ))}
      </div>

      {/* Catalog Items Skeleton */}
      <div className="px-4 pt-3 flex flex-col gap-3">
        {/* Featured Recommendation Banner Skeleton */}
        <div className="w-full rounded-2xl bg-[#ede7e3] dark:bg-[#201511] p-4 flex items-center justify-between min-h-[120px] border border-transparent dark:border-[#382820]">
          <div className="flex-1 pr-2 flex flex-col gap-2">
            <div className="h-3 w-28 rounded bg-[#d3c3be] dark:bg-[#34241d]"></div>
            <div className="h-5 w-44 rounded bg-[#d3c3be] dark:bg-[#34241d]"></div>
            <div className="h-3 w-56 rounded bg-[#d3c3be] dark:bg-[#34241d]"></div>
            <div className="h-8 w-28 rounded-lg bg-[#d3c3be] dark:bg-[#34241d] mt-1"></div>
          </div>
          <div className="w-20 h-20 rounded-xl bg-[#d3c3be] dark:bg-[#34241d] flex-shrink-0"></div>
        </div>

        {/* Section Header Skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-48 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
          <div className="h-4 w-24 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
        </div>

        {/* Product Rows Skeleton */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-full bg-white dark:bg-[#1c1410] rounded-2xl p-3 border border-[#e8e1d9] dark:border-[#342721] flex items-center gap-3"
          >
            <div className="w-20 h-20 rounded-xl bg-[#ede7e3] dark:bg-[#281b15] flex-shrink-0"></div>
            <div className="flex-1 flex flex-col justify-between h-20 py-0.5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="h-4 w-32 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
                  <div className="h-4 w-16 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
                </div>
                <div className="h-3 w-48 rounded bg-[#ede7e3] dark:bg-[#281b15] mt-1.5"></div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <div className="h-4 w-16 rounded bg-[#ede7e3] dark:bg-[#281b15]"></div>
                <div className="h-7 w-24 rounded-full bg-[#ede7e3] dark:bg-[#281b15]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
