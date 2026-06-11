# Pintel Design System — DevExpress WPF

핀텔 디자인 시스템을 **DevExpress WPF**에서 동일하게 사용하기 위한 토큰 + 컴포넌트 스타일입니다.
웹(React)과 **동일한 토큰 값**을 단일 기준으로 미러링했습니다.

## 구조
```
wpf/
├─ Pintel.Tokens.xaml   # 1단계: 공통 토큰 (Color / Typography 19종 / Spacing / Elevation / Motion)
├─ Pintel.Button.xaml   # Actions > Button 4종 (Primary·Secondary × Solid·Outline) + 상태
└─ README.md
```

## 적용 방법

### 1) App.xaml 에 병합 (토큰을 가장 먼저)
```xml
<Application.Resources>
  <ResourceDictionary>
    <ResourceDictionary.MergedDictionaries>
      <ResourceDictionary Source="/YourApp;component/wpf/Pintel.Tokens.xaml"/>
      <ResourceDictionary Source="/YourApp;component/wpf/Pintel.Button.xaml"/>
    </ResourceDictionary.MergedDictionaries>
  </ResourceDictionary>
</Application.Resources>
```

### 2) 사용
```xml
<dx:SimpleButton Content="분석 시작" Style="{StaticResource Pintel.Button.PrimarySolid}"/>
<dx:SimpleButton Content="목록 보기" Style="{StaticResource Pintel.Button.SecondarySolid}"/>
<dx:SimpleButton Content="필터 지정" Style="{StaticResource Pintel.Button.PrimaryOutline}"/>
<dx:SimpleButton Content="취소"      Style="{StaticResource Pintel.Button.SecondaryOutline}"/>
```
> 순정 WPF `Button`에 쓰려면 각 Style 의 `TargetType` 을 `Button` 으로 바꾸면 동일하게 동작합니다.

## DevExpress 컨트롤 매핑 (점진 구현 기준)
| 디자인 시스템 | DevExpress WPF 컨트롤 |
|---|---|
| Button | `SimpleButton` ✅(완료) |
| Checkbox / Radio | `CheckEdit` (RadioGroup 시 `IsThreeState=false`) |
| Switch | `ToggleSwitchEdit` |
| Select | `ComboBoxEdit` |
| Text field / Search | `TextEdit` (Search 는 ButtonInfo 로 아이콘) |
| Slider | `TrackBarEdit` |
| Date / Time picker | `DateEdit` / `TimeEdit` |
| Tooltip / Popup | `DXToolTip` / `PopupBaseEdit`, `FlyoutControl` |

## 점진 구현 로드맵
- [x] **0. 토큰** (Color / Typography / Spacing / Elevation / Motion)
- [x] **1. Actions** — Button ✅ / Chip · Text button · Tab button · Action area (예정)
- [ ] **2. Selection & input** — Checkbox · Radio · Switch · Select · Text field · Search · Slider · Segmented · Date/Time
- [ ] **3. Contents** — Card · Avatar · Content badge · List card/cell
- [ ] **4. Feedback** — Alert · Toast · Snackbar · Section message
- [ ] **5. Navigation** — Tab · Pagination · Top/Bottom nav · Progress
- [ ] **6. Presentation** — Tooltip · Popover · Menu · Popup · Bottom sheet

## 주의 / 한계
- **폰트**: `Pretendard GOV` 를 앱에 임베드해야 합니다. 폰트 파일을 프로젝트에 `Resource` 로 추가 후
  `Pintel.Tokens.xaml` 의 `Pintel.Font` 를 `pack://application:,,,/Fonts/#Pretendard GOV` 로 교체하세요. (미임베드 시 Segoe UI/맑은 고딕 폴백)
- **letter-spacing**: WPF에 직접 속성이 없어 토큰화하지 않았습니다. 정밀히 맞추려면 `TextBlock` 첨부 속성을 별도 구현해야 합니다 (대부분의 UI 텍스트에선 영향 미미).
- **sys 네임스페이스**: .NET Core/5+ 에서 오류 시 `Pintel.Tokens.xaml` 의 `assembly=mscorlib` 를 `assembly=System.Runtime` 으로 바꾸세요.
- **컴파일 검증**: 이 파일들은 스펙에 맞춰 작성했으나, 이 환경에는 .NET/DevExpress 빌드 툴이 없어 **실제 컴파일 검증은 못 했습니다.** DevExpress 버전에 따라 `SimpleButton` 템플릿 파트 등 미세 조정이 필요할 수 있습니다. 빌드 후 알려주시면 바로 맞추겠습니다.

## 토큰 동기화 (권장)
토큰은 웹 소스(`src/data/components.js`)가 단일 기준입니다. 추후 변경 시 양쪽이 어긋나지 않도록,
`components.js → Pintel.Tokens.xaml(+tokens.css)` 를 자동 생성하는 빌드 스크립트를 추가하는 것을 권장합니다(요청 시 작성).
