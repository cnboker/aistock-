import React, { useState, useMemo } from 'react';
import { Sliders, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';

interface FeatureItem {
  id: string;
  name: string;
  pillar: string;
  baseWeight: number;
}

export const TuningSandbox: React.FC = () => {
  // Available features across pillars
  const candidateFeatures: FeatureItem[] = [
    { id: '1', name: 'feat_trend_score_cs', pillar: 'Trend / Momentum', baseWeight: 0.15 },
    { id: '2', name: 'feat_money_flow_mean_day_cs', pillar: 'Money Flow', baseWeight: 0.20 },
    { id: '3', name: 'feat_atr_pct_cs', pillar: 'Volatility Risk', baseWeight: 0.18 },
    { id: '4', name: 'feat_hurst_cs', pillar: 'Long Memory / Fractal', baseWeight: 0.14 },
    { id: '5', name: 'feat_micro_vol_price_corr_swing_cs', pillar: 'Microstructure', baseWeight: 0.16 },
    { id: '6', name: 'feat_entropy_trend_swing_cs', pillar: 'Entropy Complexity', baseWeight: 0.17 },
    { id: '7', name: 'feat_money_surge_day_month_cs', pillar: 'Money Flow', baseWeight: 0.15 },
    { id: '8', name: 'feat_vol_quality_fortnight_cs', pillar: 'Volatility Risk', baseWeight: 0.12 },
  ];

  // Selected features state (Defaulting to the bad baseline: only 2 features)
  const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2']);
  const [enableOrthogonalization, setEnableOrthogonalization] = useState(false);
  const [learningRate, setLearningRate] = useState(0.005);
  const [featureFraction, setFeatureFraction] = useState(0.8);
  const [lambdaL2, setLambdaL2] = useState(1.5);
  const [dualAlphaLambdaWeight, setDualAlphaLambdaWeight] = useState(1.0);
  const [copied, setCopied] = useState(false);

  const toggleFeature = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 1) return; // keep at least 1
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const applyOptimalPreset = () => {
    setSelectedIds(['1', '2', '3', '4', '5', '6', '7', '8']);
    setEnableOrthogonalization(true);
    setLearningRate(0.015);
    setFeatureFraction(0.65);
    setLambdaL2(5.0);
    setDualAlphaLambdaWeight(0.65);
  };

  const resetToFailureBaseline = () => {
    setSelectedIds(['1', '2']);
    setEnableOrthogonalization(false);
    setLearningRate(0.005);
    setFeatureFraction(0.8);
    setLambdaL2(1.5);
    setDualAlphaLambdaWeight(1.0);
  };

  // Real-time calculated simulation metrics
  const simulationResults = useMemo(() => {
    const k = selectedIds.length;
    // Calculate Top1 feature share simulation
    let top1Share = 0;
    if (k === 1) top1Share = 1.0;
    else if (k === 2) {
      top1Share = enableOrthogonalization ? 0.65 : 0.88;
    } else {
      // With more features and L2 penalty
      const naturalShare = 1.0 / k;
      const penaltyDiscount = (lambdaL2 - 1.5) * 0.03;
      const baggingBenefit = (1 - featureFraction) * 0.15;
      const orthoBenefit = enableOrthogonalization ? 0.08 : 0;
      top1Share = Math.max(0.18, Math.min(0.88, naturalShare * 1.8 - penaltyDiscount - baggingBenefit - orthoBenefit));
    }

    // Health Score calculation
    let health = 100;
    if (top1Share > 0.45) {
      health -= 35; // major gate penalty
    }
    if (k < 4) {
      health -= 20; // feature diversity penalty
    }
    if (dualAlphaLambdaWeight > 0.9) {
      health -= 10; // no fallback residual defense
    }
    if (lambdaL2 < 2.5) {
      health -= 5;
    }
    if (enableOrthogonalization) {
      health += 10;
    }
    health = Math.max(30, Math.min(98, health));

    const gatePassed = top1Share <= 0.45 && health >= 80;
    const estOosIC = Math.max(0.02, 0.03 + (k * 0.008) + (enableOrthogonalization ? 0.02 : 0) - (top1Share > 0.6 ? 0.03 : 0));
    const estSharpe = (estOosIC * 24.5).toFixed(2);

    return {
      k,
      top1Share: (top1Share * 100).toFixed(1),
      healthScore: health,
      gatePassed,
      estOosIC: estOosIC.toFixed(4),
      estSharpe
    };
  }, [selectedIds, enableOrthogonalization, learningRate, featureFraction, lambdaL2, dualAlphaLambdaWeight]);

  const handleCopyYaml = () => {
    const featuresList = candidateFeatures
      .filter((f) => selectedIds.includes(f.id))
      .map((f) => `  - ${f.name}`)
      .join('\n');

    const yaml = `version: alpha_genome_sandbox_export
features:
${featuresList}
model:
  params:
    learning_rate: ${learningRate}
    feature_fraction: ${featureFraction}
    lambda_l2: ${lambdaL2}
    max_depth: 3
    num_leaves: 7
fusion:
  lambda_weight: ${dualAlphaLambdaWeight}
  research_residual_weight: ${(1 - dualAlphaLambdaWeight).toFixed(2)}
`;
    navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <span>量化特征组合与模型权重模拟实验室 (Simulation Sandbox)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            交互式切换特征池与 LightGBM 超参数，实时测算生产门禁通过率、Top1 特征集中度及预期夏普比率
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={resetToFailureBaseline}
            className="px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-semibold hover:bg-rose-900/60 transition-colors"
          >
            重置为本次失败工况 (2特征)
          </button>
          <button
            onClick={applyOptimalPreset}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>一键载入推荐最优参数</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Control Panel vs Real-time Health Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-7 space-y-4">
          {/* Feature Selector */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                1. 选择输入特征池 (当前已选 {selectedIds.length} 个)
              </h4>
              <label className="flex items-center space-x-2 cursor-pointer text-xs text-amber-300 font-mono">
                <input
                  type="checkbox"
                  checked={enableOrthogonalization}
                  onChange={(e) => setEnableOrthogonalization(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>启用截面正交化 (Gram-Schmidt)</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {candidateFeatures.map((f) => {
                const isSelected = selectedIds.includes(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleFeature(f.id)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-white font-medium'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-slate-200">{f.name}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{f.pillar}</div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                        isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isSelected ? '✓' : '+'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hyperparameter Sliders */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              2. 调优超参数与正则化权重
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Feature Fraction (特征子采样):</span>
                  <span className="text-amber-400 font-bold">{featureFraction}</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.0"
                  step="0.05"
                  value={featureFraction}
                  onChange={(e) => setFeatureFraction(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Lambda L2 (叶子权重正则化惩罚):</span>
                  <span className="text-amber-400 font-bold">{lambdaL2}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.5"
                  value={lambdaL2}
                  onChange={(e) => setLambdaL2(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-300">Dual Alpha: Lambda 权重 vs 规则残差权重:</span>
                  <span className="text-amber-400 font-bold">
                    λ={dualAlphaLambdaWeight} / Res={(1 - dualAlphaLambdaWeight).toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={dualAlphaLambdaWeight}
                  onChange={(e) => setDualAlphaLambdaWeight(parseFloat(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Simulation Dashboard */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-850 border border-slate-800 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>模拟生产门禁体检报告</span>
              <span
                className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold ${
                  simulationResults.gatePassed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {simulationResults.gatePassed ? 'GATE: PASS' : 'GATE: REJECT'}
              </span>
            </h4>

            {/* Health Score Gauge */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block mb-1">模拟健康得分 (Health Score)</span>
              <div className="flex items-baseline justify-center space-x-1">
                <span
                  className={`text-4xl font-extrabold font-mono ${
                    simulationResults.healthScore >= 80 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {simulationResults.healthScore}
                </span>
                <span className="text-sm font-mono text-slate-500">/ 100</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {simulationResults.healthScore >= 80
                  ? '✅ 门禁指标健康，不存在单特征垄断与极端脆弱性'
                  : '❌ 存在单点故障或特征池多样性不足风险，将被自动拦截'}
              </p>
            </div>

            {/* Key Diagnostic metrics */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Top1 特征最大占比:</span>
                <span
                  className={`font-bold ${
                    parseFloat(simulationResults.top1Share) <= 45.0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {simulationResults.top1Share}% (安全门槛 &lt;= 45%)
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">输入特征多样性规模:</span>
                <span className="text-slate-200">{simulationResults.k} 个特征</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">预估样本外 OOS RankIC:</span>
                <span className="text-amber-400 font-bold">+{simulationResults.estOosIC}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">预估回测夏普比率 (Sharpe):</span>
                <span className="text-emerald-400 font-bold">{simulationResults.estSharpe}</span>
              </div>
            </div>

            {/* Export Config Action */}
            <button
              onClick={handleCopyYaml}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已复制优化后 Genome 配置至剪贴板</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>复制调优配置 YAML (alpha_genome.yaml)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
