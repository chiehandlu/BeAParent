export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  /** 最後一次人工確認連結與內容仍正確的日期（YYYY-MM-DD）；null 表示尚未查證，上線前必須補上。 */
  verifiedAt: string | null;
}

export const SOURCES: Record<string, Source> = {
  "hpa-mammy": {
    id: "hpa-mammy",
    title: "孕產婦關懷網站",
    publisher: "衛生福利部國民健康署",
    url: "https://mammy.hpa.gov.tw/",
    verifiedAt: null,
  },
  "cdc-vaccine": {
    id: "cdc-vaccine",
    title: "預防接種",
    publisher: "衛生福利部疾病管制署",
    url: "https://www.cdc.gov.tw/",
    verifiedAt: null,
  },
  "sfaa-childcare": {
    id: "sfaa-childcare",
    title: "育兒津貼與托育補助",
    publisher: "衛生福利部社會及家庭署",
    url: "https://www.sfaa.gov.tw/",
    verifiedAt: null,
  },
};
