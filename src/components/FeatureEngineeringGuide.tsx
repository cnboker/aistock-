import React, { useState } from 'react';
import { Layers, Sparkles, Code, CheckCircle, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const FeatureEngineeringGuide: React.FC = () => {
  const [activeRecipe, setActiveRecipe] = useState<number>(1);

  const recipes = [
    {
      id: 1,
      title: '正交化去共线性工程 (Gram-Schmidt Orthogonalization)',
      tag: '解决 11 对高度共线性与特征冗余',
      problem: '当前系统中存在多对相关系数高达 0.95~0.98 的特征（如 feat_prediction_std_cs 与 feat_entropy_prediction_cs 相关度 0.989），树模型分裂时相互抵消，无法捕获纯净 Alpha。',
      solution: '构建因子聚类树，对同质簇使用施密特（Gram-Schmidt）正交化或截面残差回归法，剥离共线性基底，仅保留正交残差。',
      codeSnippet: `# Python 实现：截面残差正交化剥离共线性
import numpy as np
import statsmodels.api as sm

def cross_sectional_orthogonalize(df, target_factor, base_factors, date_col='timestamp'):
    """
    对 target_factor 剥离 base_factors 的线性投影，输出纯净正交残差
    """
    ortho_series = []
    for dt, group in df.groupby(date_col):
        X = group[base_factors].values
        X = sm.add_constant(X)
        y = group[target_factor].values
        
        # OLS 回归求残差 epsilon = y - X * beta
        model = sm.OLS(y, X, missing='drop').fit()
        residuals = y - model.predict(X)
        
        # 截面重新标准化
        std_res = (residuals - np.nanmean(residuals)) / (np.nanstd(residuals) + 1e-8)
        ortho_series.append(pd.Series(std_res, index=group.index))
        
    return pd.concat(ortho_series)
`
    },
    {
      id: 2,
      title: '状态感知背离特征工程 (Regime-Conditioned Divergence)',
      tag: '根治 feat_money_flow_mean_day_cs 的 OOS_FLIP 翻转',
      problem: '资金流均值在动量牛市中为正相关，在震荡市或反转市中为负相关（主力高位出货）。直接线性输入该因子导致跨期 OOS 从 +0.044 翻转为 -0.010。',
      solution: '将资金流从“单纯金额均值”改造为“量价背离比率 (Price-Volume Divergence)”与“波动率分位条件特征”。当资金净流入但价格动量滞涨时，作为衰竭信号惩罚，保持全周期逻辑一致。',
      codeSnippet: `# Python 实现：量价背离与状态感知特征
def compute_volume_price_divergence(df, lookback_window=12):
    # 1. 计算截面百分比排名
    rank_money = df.groupby('timestamp')['feat_money_flow_mean_day'].rank(pct=True)
    rank_price_mom = df.groupby('timestamp')['feat_slope_cs'].rank(pct=True)
    
    # 2. 计算量价背离度 (资金流入极大但价格滞涨 = 潜在出货背离)
    divergence = rank_money - rank_price_mom
    
    # 3. 结合微观波动率状态加权
    # 当处于高波动率分位时，加大背离惩罚权重
    vol_regime = df['feat_atr_pct_cs'] > df.groupby('timestamp')['feat_atr_pct_cs'].transform('median')
    conditioned_feature = np.where(vol_regime, -np.abs(divergence), rank_money)
    
    return conditioned_feature
`
    },
    {
      id: 3,
      title: '五大因子族群分层准入体系 (5-Pillar Factor Universe)',
      tag: '解决特征池从 40 萎缩至 2 的断流危机',
      problem: '上游筛选阈值过度苛刻，淘汰了 35 个因子，导致进入训练的特征池只有 2 个，树模型连 feature_fraction=0.8 都无法生效，单特征独占 88% 权重。',
      solution: '建立 5 大正交因子分类族库，实施“配额准入制”：每个族库通过族内竞争选拔 1~2 个稳定性最高的代表性因子，确保最终输入模型 8~10 个多元正交特征。',
      codeSnippet: `# 建议构建的 5 大独立特征族群配额配置：
FACTOR_PILLARS = {
    "Pillar_1_RiskVolatility": [
        "feat_atr_pct_cs",               # 真实波动率占比 (单调性 88.89%)
        "feat_vol_quality_fortnight_cs"  # 波动率质量
    ],
    "Pillar_2_Microstructure": [
        "feat_micro_vol_price_corr_swing_cs", # 量价相关性 (稳定性 0.848)
        "feat_micro_voi_ema_fast_cs"          # 成交量失衡 EMA
    ],
    "Pillar_3_MoneyFlow": [
        "feat_money_surge_day_month_cs",  # 资金异动 (跨折胜率 100%)
        "feat_money_divergence_month_cs"  # 月度资金背离
    ],
    "Pillar_4_LongMemoryTrend": [
        "feat_hurst_cs",                  # 赫斯特指数分形 (稳定性 0.564, 胜率 100%)
        "feat_slope_cs"                   # 趋势斜率
    ],
    "Pillar_5_EntropyComplexity": [
        "feat_entropy_trend_swing_cs"     # 摆动熵趋势 (单调性 88.89%, ICIR_NW 0.192)
    ]
}
`
    },
    {
      id: 4,
      title: '时序中位数绝对偏差与截面缩尾 (Robust Scaling)',
      tag: '消除日度极端大单与重叠自相关水分',
      problem: '未作自适应缩尾处理，导致 30m 频率下极少量大单或跳空异常值扭曲了横截面 Z-Score，且 Newey-West HAC 调整显示原始 IC 水分过高。',
      solution: '在截面标准化前，使用 MAD (Median Absolute Deviation) 进行自适应 3 倍稳健截断，并应用 EWMA 衰减，避免单笔异动污染整日均值。',
      codeSnippet: `# Python 实现：截面稳健 MAD 缩尾与自适应平滑
def robust_mad_cross_section_scale(df, factor_col, date_col='timestamp', n_mad=3.0):
    def _scale_group(group):
        vals = group[factor_col].values
        med = np.nanmedian(vals)
        mad = np.nanmedian(np.abs(vals - med)) + 1e-8
        
        # 3*MAD 缩尾
        clipped = np.clip(vals, med - n_mad * 1.4826 * mad, med + n_mad * 1.4826 * mad)
        # Rank 映射到 [-1, 1] 区间避免厚尾异常
        ranks = pd.Series(clipped).rank(pct=True).values * 2 - 1
        return pd.Series(ranks, index=group.index)
        
    return df.groupby(date_col, group_keys=False).apply(_scale_group)
`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>量化特征工程四大重构方案 (Feature Engineering Revamp)</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          针对当前报告中暴露出的“共线性冗余严重”、“关键因子 OOS 符号翻转”、“特征筛选池单薄萎缩至 2 个”等核心痛点，
          提供可直接工程落地的四大改进算法配方。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left selector */}
        <div className="space-y-2 lg:col-span-1">
          {recipes.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveRecipe(item.id)}
              className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                activeRecipe === item.id
                  ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                  : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-amber-400 font-bold">方案 0{item.id}</span>
                {activeRecipe === item.id && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="font-semibold text-slate-200">{item.title.split(' (')[0]}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.tag}</div>
            </button>
          ))}
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-3 p-5 rounded-xl bg-slate-850 border border-slate-800 space-y-4">
          {(() => {
            const cur = recipes.find((r) => r.id === activeRecipe) || recipes[0];
            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-white">{cur.title}</h4>
                    <span className="text-xs text-amber-400 font-medium">{cur.tag}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium self-start sm:self-center">
                    推荐采纳等级: P0
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40">
                    <span className="text-rose-400 font-semibold block mb-1">【针对的现状病因】</span>
                    <p className="text-slate-300 leading-relaxed">{cur.problem}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40">
                    <span className="text-emerald-400 font-semibold block mb-1">【工程重构目标】</span>
                    <p className="text-slate-300 leading-relaxed">{cur.solution}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-mono text-amber-300">
                      <Code className="w-3.5 h-3.5" />
                      <span>生产级 Python 代码实现参考</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">pandas / statsmodels / numpy</span>
                  </div>
                  <pre className="p-3 rounded bg-slate-900/90 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800/80">
                    {cur.codeSnippet}
                  </pre>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
