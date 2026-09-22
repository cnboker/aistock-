import React from 'react';
import { Sliders, Wrench, ShieldCheck, Check, AlertTriangle, ArrowRight, Zap, Target } from 'lucide-react';
import { MODEL_TRAINING_METRICS } from '../data/reportData';

export const ModelTuningGuide: React.FC = () => {
  const currentParams = [
    { name: 'learning_rate', current: '0.005', recommended: '0.015', reason: '当前学习率过低，迭代在 25 轮就早停，模型有效表征能力未能充分释放' },
    { name: 'feature_fraction', current: '0.8', recommended: '0.65 (特征库扩充至8后)', reason: '当前仅有 2 个特征，0.8*2=1.6 等同于每棵树全量选入，Feature Bagging 彻底失效！' },
    { name: 'num_leaves', current: '8', recommended: '7', reason: '配合 max_depth=3，num_leaves 设定为 7 (即 2^3 - 1) 可保证完全平衡二叉树，避免单支过度深挖' },
    { name: 'max_depth', current: '3', recommended: '3', reason: '针对金融截面低信噪比数据，深度 3 能够较好平衡二阶交互与过拟合风险，建议保持' },
    { name: 'lambda_l2 (L2 正则)', current: '1.5', recommended: '4.5 ~ 6.0', reason: '大幅提高叶子节点权重 L2 惩罚，直接抑制单特征在叶子节点输出极大极小预测值' },
    { name: 'min_child_samples', current: '50', recommended: '60', reason: '每叶片样本数适当上调，提高单次截面排序分割的统计显著性' },
    { name: 'min_split_gain', current: '0.0 (默认未设)', recommended: '0.02', reason: '强制要求分裂必须带来至少 0.02 的增益，防止决策树对微弱噪声进行无效切分' },
    { name: 'feature_penalty', current: '未配置', recommended: '[0.5, 1.0, ...]', reason: '对高频敏感资金流特征加权惩罚，对长周期稳健特征给予增益，直接调控重要性分布' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-400" />
          <span>LambdaRank 模型训练与融合权重调优指南</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          针对生产门禁失败 (Health 60/100, REJECT)、Top1 特征占比高达 88.0%、以及 Dual Alpha 极端配置 (λ=1.0, Res=0.0) 给出精准调优参数表与工程落地方案。
        </p>
      </div>

      {/* Parameter Comparison Table */}
      <div className="p-5 rounded-xl bg-slate-850 border border-slate-800">
        <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>LightGBM LambdaRank 超参数对比与修正建议</span>
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          直接修改配置文件 <code className="text-amber-300 font-mono">quant_research/config/alpha_genome.yaml</code> 中的 model 参数：
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900 text-slate-300">
                <th className="py-2.5 px-3">参数名 (Parameter)</th>
                <th className="py-2.5 px-3 text-rose-400">当前值 (Current)</th>
                <th className="py-2.5 px-3 text-emerald-400">推荐调优值 (Recommended)</th>
                <th className="py-2.5 px-3">调优原理与机理说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {currentParams.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-100">{p.name}</td>
                  <td className="py-2.5 px-3 text-rose-300 font-bold">{p.current}</td>
                  <td className="py-2.5 px-3 text-emerald-300 font-bold">{p.recommended}</td>
                  <td className="py-2.5 px-3 text-slate-400 leading-relaxed font-sans">{p.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Gate Fix Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400">
            <ShieldCheck className="w-5 h-5" />
            <h4 className="text-sm font-bold text-white">生产门禁拦截破局：特征多样性约束</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            门禁熔断的核心指标是 <strong className="text-rose-300">Top1 特征占比不得超过 45.0%</strong>。
            当前特征集中度高达 88.0%，核心病灶在于上游输入特征仅有 2 个。
          </p>
          <div className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-slate-300 space-y-1">
            <div className="text-amber-400 font-semibold mb-1">【数学推论】</div>
            <div>当特征数 K = 2 时，只要一个特征稍优，其占比必然 &gt; 50%；</div>
            <div>要使任何单个特征占比 &lt;= 45%，理论上至少需要：</div>
            <div className="text-emerald-400 font-bold">K &gt;= 5 ~ 8 个独立弱相关特征！</div>
          </div>
          <p className="text-xs text-slate-400">
            解决方案：放宽上游 Evidence 筛选门槛，从 5 大特征族群各选 1~2 个特征输入，树模型将在不同特征上平衡分裂，Top1 占比将自然回落至 20%~35% 的安全区间。
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <Zap className="w-5 h-5" />
            <h4 className="text-sm font-bold text-white">Dual Alpha 融合权重重构：告别极端的 1.0 vs 0.0</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            在当前导出的 <code className="font-mono text-amber-300">frozen_dual_alpha_config.json</code> 中，
            权重被锁定为 <code className="font-mono text-white">lambda_weight: 1.0, research_residual_weight: 0.0</code>。
          </p>
          <div className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-slate-300 space-y-1.5">
            <div className="flex justify-between">
              <span>当前权重策略:</span>
              <span className="text-rose-400 font-bold">100% 依赖 Lambda 模型 (残差权重为 0)</span>
            </div>
            <div className="flex justify-between">
              <span>评估有效非重叠周期:</span>
              <span className="text-rose-400 font-bold">仅 7 期 (统计严重不足)</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-emerald-400">
              <span>推荐动态自适应权重:</span>
              <span className="font-bold">λ_weight: 0.65 · Residual_weight: 0.35</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            机理：规则型 Research Alpha 具备高可解释性与底线抗极端风险能力，将其保留 30%~40% 的残差权重，
            能有效对冲单模型在市场风格剧烈切换时出现 OOS_FLIP 带来的致命亏损。
          </p>
        </div>
      </div>

      {/* Suggested Complete Pipeline YAML */}
      <div className="p-5 rounded-xl bg-slate-850 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>最终调优后的配置文件建议 (alpha_genome.yaml)</span>
          </h4>
          <span className="text-xs font-mono text-slate-400">YAML 配置模板</span>
        </div>
        <pre className="p-4 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`version: alpha_genome_v2_optimized
created_date: '2026-09-22'
features:
  # 5大独立正交族群各选优胜因子 (共8个特征，消除共线性与单点故障)
  - feat_atr_pct_cs                     # 波动率占比 (单调性 88.89%)
  - feat_vol_quality_fortnight_cs       # 波动率质量
  - feat_micro_vol_price_corr_swing_cs  # 微观量价相关性 (稳定性 0.848)
  - feat_micro_voi_ema_fast_cs          # 成交量失衡 EMA
  - feat_money_surge_day_month_cs       # 资金异动突增 (跨期胜率 100%)
  - feat_money_divergence_month_cs      # 月度资金背离
  - feat_hurst_cs                       # 分形赫斯特指数 (稳定性 0.564, 胜率 100%)
  - feat_entropy_trend_swing_cs         # 摆动熵趋势 (单调性 88.89%, ICIR_NW 0.192)

model:
  type: lightgbm_lambdarank
  objective: lambdarank
  metric: ndcg
  params:
    learning_rate: 0.015
    num_leaves: 7
    max_depth: 3
    min_child_samples: 60
    feature_fraction: 0.65       # 8个特征每次随机抽 5~6 个，彻底激活 Feature Bagging
    bagging_fraction: 0.8
    bagging_freq: 2
    lambda_l2: 5.0              # 强化 L2 正则约束，抑制极端叶子分值
    min_split_gain: 0.02        # 阻止微弱信息增益无效分裂
    ndcg_eval_at: [1, 3, 5]

portfolio:
  top_n: 10                     # 适度分散持仓由 Top5 扩至 Top10
  weighting: score_softmax
  ascending: false

risk:
  enable: true
  max_position:
    per_stock: 0.2              # 单股上限由 0.4 降至 0.2，降低个股黑天鹅风险

fusion:
  lambda_weight: 0.65           # 摆脱 1.0 vs 0.0 极端配置
  research_residual_weight: 0.35
`}
        </pre>
      </div>
    </div>
  );
};
