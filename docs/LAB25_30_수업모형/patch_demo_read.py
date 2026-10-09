# -*- coding: utf-8 -*-
"""탐구 보고서 블록을 가진 실험 화면이 read() 를 내주도록 바꾼다.

왜
  LAB 25~30 의 실험 화면은 이미 `inquiry(root, {... read:()=>[...]})` 를 갖고 있다.
  그 read() 를 수업 모형의 탐구 노트가 그대로 쓰면 된다 — 새로 만들 것이 없다.
  다만 수업 모형은 **기록 단계에서 탐구 보고서를 따로 만든다.** 그대로 두면 한 화면에 두 벌이 생긴다.

무엇을 하나
  `inquiry(root,{…})` 를 `const INQ={…}` 로 바꾸고,
  · 수업 모형 안(#lsLab)이 아니면 지금까지처럼 보고서를 그린다
  · 언제나 `{read: INQ.read}` 를 돌려준다
  수업 모형이 없는 실험실은 동작이 전혀 바뀌지 않는다.

사용: python docs/LAB25_30_수업모형/patch_demo_read.py src/40-demos.js
"""
import sys

FNS = ['primeDemo', 'intDemo', 'letterDemo', 'scaleDemo', 'propDemo', 'paraDemo',
       # LAB 31~40
       'congDemo', 'sectDemo', 'repM1Demo', 'histDemo', 'gcdDemo',
       'constructDemo', 'polyDemo', 'solidDemo', 'boxDemo', 'stemDemo',
       # LAB 41~50
       'relfreqDemo', 'statInqDemo', 'linexprDemo', 'coordDemo', 'sqrtAddDemo',
       'spiralDemo', 'mentalDemo', 'quadRootDemo', 'discrimDemo', 'complSqDemo',
       # LAB 51~60
       'parabShiftDemo', 'fenceDemo', 'xpDemo', 'taDemo', 'tbDemo',
       'iaDemo', 'tnDemo', 'cyDemo', 'bxDemo', 'ocDemo',
       # LAB 61~70
       'sieveDemo', 'absErrDemo', 'substDemo', 'saltDemo', 'pbisectDemo',
       'abisectDemo', 'arcAreaDemo', 'platonicDemo', 'ineqDemo', 'hashDemo',
       # LAB 71~80
       'fracDecDemo', 'recurDemo', 'foldDemo', 'flipDemo', 'sysDemo',
       'elimDemo', 'slopeDemo', 'lineFitDemo', 'centroidDemo', 'paragramDemo',
       # LAB 81~90
       'scaleMapDemo', 'homothetyDemo', 'pythaDemo', 'pythaConvDemo', 'tripleDemo',
       'countDemo', 'cubeScaleDemo', 'complementDemo', 'indepDemo', 'condProbDemo',
       # LAB 91~100
       'probAddDemo', 'snDemo', 'rmDemo', 'cxDemo', 'vtDemo',
       'cbDemo', 'qiDemo', 'lpDemo', 'pmDemo', 'mxDemo',
       # LAB 101~110
       'ncDemo', 'ovDemo', 'clDemo', 'origamiDemo', 'decayDemo',
       'unitCircleDemo', 'sunriseDemo', 'lawsDemo', 'loanDemo', 'sigmaDemo',
       # LAB 111~120
       'dominoDemo', 'expEqDemo', 'logBaseDemo', 'expLogDemo', 'log10Demo',
       'expMoveDemo', 'trigParamDemo', 'trigEqDemo', 'trigSumDemo', 'heronDemo',
       # LAB 121~130
       'fourierDemo', 'apDemo', 'apGpDemo', 'sumDataDemo', 'recurSeqDemo',
       'savingDemo', 'lrLimDemo', 'zeroDivDemo', 'discontDemo', 'ivtDemo',
       # LAB 131~140
       'evtDemo', 'cuspDemo', 'tangentDemo', 'signDerivDemo', 'boxOptDemo',
       'motionDemo', 'riemannDemo', 'ftcDemo', 'accumDemo', 'betweenDemo',
       # LAB 141~150
       'diskVolDemo', 'pascalDemo', 'starsBarsDemo', 'binomExpDemo', 'exclIndepDemo',
       'meetProbDemo', 'falsePosDemo', 'chiIndepDemo', 'expectDemo', 'varSpreadDemo',
       # LAB 151~160
       'binomDistDemo', 'deMoivreDemo', 'sigmaRuleDemo', 'clTheoremDemo', 'ciMeaningDemo',
       'sampleSizeDemo', 'paraFocusDemo', 'ellipsePinDemo', 'hyperAsymDemo', 'tdoaDemo',
       # LAB 161~170
       'tangentCondDemo', 'vecAddDemo', 'vecScaleDemo', 'dotAngleDemo', 'projLenDemo',
       'projAreaDemo', 'threePerpDemo', 'space3dDemo', 'sphereCutDemo', 'coneCutDemo',
       # LAB 171~180
       'posVecDemo', 'seqLimitDemo', 'gpConvDemo', 'seriesPartDemo', 'repeatDecDemo',
       'sincLimitDemo', 'expDerivDemo', 'trigDerivDemo', 'chainRuleDemo', 'implicitDemo',
       # LAB 181~190
       'inflectDemo', 'substIntDemo', 'byPartsDemo', 'motionVecDemo', 'arcLenDemo',
       'diffEqDemo', 'perceptronDemo', 'accTrapDemo', 'textVecDemo', 'tfidfDemo',
       # LAB 191~200
       'jaccardDemo', 'imgMatrixDemo', 'rgbLayerDemo', 'transposeDemo', 'matMulDemo',
       'hammingDemo', 'denseLayerDemo', 'lossCurveDemo', 'mseMaeDemo', 'lrateDemo']

TAIL = """};
  /* 수업 모형 안에서는 기록 단계가 보고서를 따로 만든다 — 두 벌이 되지 않게 */
  if(!root.closest('#lsLab')) inquiry(root, INQ);
  return { read: INQ.read };
}"""


def body_of(h, fn):
    i = h.find('function %s(' % fn)
    assert i > 0, '%s 를 못 찾음' % fn
    k, dep, started = i, 0, False
    while k < len(h):
        if h[k] == '{':
            dep += 1
            started = True
        elif h[k] == '}':
            dep -= 1
            if started and dep == 0:
                break
        k += 1
    return i, k + 1


def main(path):
    h = open(path, encoding='utf-8').read()
    done = []
    for fn in FNS:
        i, j = body_of(h, fn)
        b = h[i:j]
        if 'const INQ=' in b:
            done.append(fn + '(이미)')
            continue
        a = 'inquiry(root,{'
        assert b.count(a) == 1, '%s — inquiry 호출이 %d곳' % (fn, b.count(a))
        nb = b.replace(a, 'const INQ={', 1)
        end = '});\n}'          # read 가 { } 로 끝나든 [ ] 로 끝나든 꼬리는 늘 이 꼴이다
        assert nb.endswith(end), '%s — 끝맺음이 예상과 다름: %r' % (fn, nb[-40:])
        nb = nb[:-len(end)] + TAIL
        h = h[:i] + nb + h[j:]
        done.append(fn)
    open(path, 'w', encoding='utf-8').write(h)
    sys.stdout.write('read() ok: ' + ' '.join(done))
    sys.stdout.write(chr(10))


if __name__ == '__main__':
    main(sys.argv[1])
