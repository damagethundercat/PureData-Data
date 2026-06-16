# Nu Disco House Wave Point Pd Package

## 포함 파일

- `nu_disco_house_wave_point.pd`: 메인 Pure Data Vanilla 패치
- `samples/wave_point_house_pd_ready/`: 패치에서 사용하는 Wave Point 샘플 사본
- `generate_nu_disco_house_wave_point.py`: 현재 로컬 워크스페이스에서 패치를 다시 생성하기 위한 스크립트

## 실행 방법

1. Pure Data Vanilla에서 `nu_disco_house_wave_point.pd`를 엽니다.
2. 패치는 로드될 때 DSP와 시퀀서를 자동으로 켭니다.
3. 상단의 transport 메시지에서 `0`은 정지, `1`은 재시작입니다.
4. `reset` 메시지는 시퀀스를 첫 마디로 되돌립니다.
5. 하단 stem mixer 슬라이더로 각 사운드의 볼륨을 조절할 수 있습니다. 기본값은 1.0이고 범위는 0부터 1.5까지입니다.

## 참고

- 샘플 경로는 패치 기준 상대 경로입니다. `samples/wave_point_house_pd_ready/` 폴더를 패치 옆에 그대로 두어야 합니다.
- `bass`와 `lead`는 Pd 오실레이터가 아니라 Wave Point 샘플 기반으로 교체되어 있습니다.
- Pd Vanilla 외부 라이브러리는 필요하지 않습니다.
- 검증 기준: `pd_lint.py` 통과, Pd no-GUI 로드 테스트 통과.
