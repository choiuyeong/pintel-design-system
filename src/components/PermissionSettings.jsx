import { useState } from 'react';
import { PrevaxTitleBar, PrevaxTabBar } from './Library';

const T = {
  primary: '#1751D9',
  primaryStrong: '#3471FF',
  primaryHeavy: '#004DFF',
  positive: '#1ED45A',
  cautionary: '#FFA938',
  error: '#FF6363',
  font: "'Pretendard GOV', sans-serif",
};

const W = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

const TYPE = {
  display1:      { fontSize: '56px', lineHeight: '72px', letterSpacing: '-0.0319em' },
  display2:      { fontSize: '40px', lineHeight: '52px', letterSpacing: '-0.0282em' },
  display3:      { fontSize: '36px', lineHeight: '48px', letterSpacing: '-0.027em' },
  title1:        { fontSize: '32px', lineHeight: '44px', letterSpacing: '-0.0253em' },
  title2:        { fontSize: '28px', lineHeight: '38px', letterSpacing: '-0.0236em' },
  title3:        { fontSize: '24px', lineHeight: '32px', letterSpacing: '-0.023em' },
  heading1:      { fontSize: '22px', lineHeight: '30px', letterSpacing: '-0.0194em' },
  heading2:      { fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.012em' },
  headline1:     { fontSize: '18px', lineHeight: '26px', letterSpacing: '-0.002em' },
  headline2:     { fontSize: '17px', lineHeight: '26px', letterSpacing: '0em' },
  body1:         { fontSize: '16px', lineHeight: '24px', letterSpacing: '0.0057em' },
  body1Reading:  { fontSize: '16px', lineHeight: '26px', letterSpacing: '0.0057em' },
  body2:         { fontSize: '15px', lineHeight: '22px', letterSpacing: '0.0096em' },
  body2Reading:  { fontSize: '15px', lineHeight: '24px', letterSpacing: '0.0096em' },
  label1:        { fontSize: '14px', lineHeight: '20px', letterSpacing: '0.0145em' },
  label1Reading: { fontSize: '14px', lineHeight: '22px', letterSpacing: '0.0145em' },
  label2:        { fontSize: '13px', lineHeight: '18px', letterSpacing: '0.0194em' },
  caption1:      { fontSize: '12px', lineHeight: '16px', letterSpacing: '0.0252em' },
  caption2:      { fontSize: '11px', lineHeight: '14px', letterSpacing: '0.0311em' },
};

// 권한 매트릭스 데이터 — PREVAXEnum.cs:100-137 기반, sort_number 순
// depth: 0=메인메뉴, 1=서브메뉴, 2=액션 / kind: 'main'|'menu'|'item'
export const PERM_ROWS = [
  { id: 0x100,  label: '모니터링',                depth: 0, kind: 'main', user: true,  mgr: true,  admin: true  },
  { id: 0x0A00, label: '설정',                    depth: 0, kind: 'main', user: false, mgr: true,  admin: true  },
  { id: 0x0A10, label: '장비 관리',               depth: 1, kind: 'menu', user: false, mgr: true,  admin: true  },
  { id: 0x0A11, label: '장비 정보 편집',          depth: 2, kind: 'item', user: false, mgr: false, admin: true  },
  { id: 0x0A12, label: '엑셀 가져오기/내보내기', depth: 2, kind: 'item', user: false, mgr: true,  admin: true  },
  { id: 0x0A20, label: '이벤트 목록',             depth: 1, kind: 'menu', user: true,  mgr: true,  admin: true  },
  { id: 0x0A21, label: '이벤트 목록 편집',        depth: 2, kind: 'item', user: false, mgr: true,  admin: true  },
  { id: 0x0A30, label: '이벤트 정의',             depth: 1, kind: 'menu', user: false, mgr: true,  admin: true  },
  { id: 0x0A31, label: '이벤트 정의 편집',        depth: 2, kind: 'item', user: false, mgr: false, admin: true  },
  { id: 0x0A40, label: '스케줄',                  depth: 1, kind: 'menu', user: false, mgr: true,  admin: true  },
  { id: 0x0A41, label: '스케줄 편집',             depth: 2, kind: 'item', user: false, mgr: false, admin: true  },
  { id: 0x0A50, label: '계정 관리',               depth: 1, kind: 'menu', user: false, mgr: false, admin: true  },
  { id: 0x0A51, label: '계정 정보 편집',          depth: 2, kind: 'item', user: false, mgr: false, admin: true  },
  { id: 0x0A52, label: '권한 편집',               depth: 2, kind: 'item', user: false, mgr: false, admin: true  },
  { id: 0x0A60, label: '데이터 보관기간',         depth: 1, kind: 'menu', user: false, mgr: false, admin: true  },
  { id: 0x0A61, label: '데이터 보관기간 편집',    depth: 2, kind: 'item', user: false, mgr: false, admin: true  },
  { id: 0x0A70, label: '실시간 영상',             depth: 1, kind: 'menu', user: true,  mgr: true,  admin: true  },
  { id: 0x0A71, label: '실시간 영상 편집',        depth: 2, kind: 'item', user: false, mgr: true,  admin: true  },
  { id: 0x0A80, label: '지역 정보 설정',          depth: 1, kind: 'menu', user: false, mgr: true,  admin: true  },
  { id: 0x0A81, label: '지역 정보 편집',          depth: 2, kind: 'item', user: false, mgr: false, admin: true  },
  { id: 0x0F00, label: '공통 기능',               depth: 0, kind: 'main', user: true,  mgr: true,  admin: true  },
  { id: 0x0F01, label: '화면 캡처',               depth: 1, kind: 'item', user: true,  mgr: true,  admin: true  },
  { id: 0x0F02, label: '이벤트 내보내기',         depth: 1, kind: 'item', user: false, mgr: true,  admin: true  },
];

export function generateXaml(perms) {
  const indent = (n) => '    '.repeat(n);
  const bool = (v) => v ? 'True' : 'False';

  const rows = PERM_ROWS.map((row) => {
    const p = perms[row.id] ?? { user: row.user, mgr: row.mgr, admin: row.admin };
    const depth = row.depth;
    const kindColor = depth === 0 ? '#1A237E' : depth === 1 ? '#1A1A2E' : 'Transparent';
    const fontW = depth === 0 ? 'SemiBold' : depth === 1 ? 'Medium' : 'Normal';
    const fg = depth === 0 ? '#E8E8EC' : depth === 1 ? '#C4C4CC' : '#9A9AA2';
    const pad = depth * 16;
    return [
      `${indent(3)}<DataGridRow Background="${kindColor}">`,
      `${indent(4)}<DataGridRow.Cells>`,
      `${indent(5)}<DataGridCell>`,
      `${indent(6)}<TextBlock Text="${row.label}" Foreground="${fg}" FontWeight="${fontW}"`,
      `${indent(7)}Padding="${12 + pad},6,8,6" FontSize="12" LineHeight="16"/>`,
      `${indent(5)}</DataGridCell>`,
      `${indent(5)}<DataGridCell><CheckBox IsChecked="${bool(p.user)}" HorizontalAlignment="Center" Margin="0,6"/></DataGridCell>`,
      `${indent(5)}<DataGridCell><CheckBox IsChecked="${bool(p.mgr)}"  HorizontalAlignment="Center" Margin="0,6"/></DataGridCell>`,
      `${indent(5)}<DataGridCell><CheckBox IsChecked="${bool(p.admin)}" HorizontalAlignment="Center" Margin="0,6"/></DataGridCell>`,
      `${indent(4)}</DataGridRow.Cells>`,
      `${indent(3)}</DataGridRow>`,
    ].join('\n');
  }).join('\n');

  return `<UserControl x:Class="PREVAX.Views.PermissionSettingsView"
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    Background="#1A1A1F" FontFamily="Pretendard GOV, Segoe UI, sans-serif">
  <UserControl.Resources>
    <Style TargetType="DataGridColumnHeader">
      <Setter Property="Background" Value="#16161A"/>
      <Setter Property="Foreground" Value="#8A8A92"/>
      <Setter Property="FontSize" Value="12"/>
      <Setter Property="Padding" Value="12,7,8,7"/>
      <Setter Property="BorderBrush" Value="#2A2A30"/>
      <Setter Property="BorderThickness" Value="0,0,0,1"/>
    </Style>
    <Style TargetType="DataGridCell">
      <Setter Property="BorderBrush" Value="#232329"/>
      <Setter Property="BorderThickness" Value="0,0,0,1"/>
      <Setter Property="Background" Value="Transparent"/>
      <Setter Property="Foreground" Value="#E8E8EC"/>
      <Setter Property="FontSize" Value="12"/>
    </Style>
    <Style TargetType="CheckBox">
      <Setter Property="Foreground" Value="#1751D9"/>
    </Style>
  </UserControl.Resources>
  <Grid>
    <Grid.ColumnDefinitions>
      <ColumnDefinition Width="186"/>
      <ColumnDefinition Width="*"/>
    </Grid.ColumnDefinitions>

    <!-- 설정 네비게이션 -->
    <Border Grid.Column="0" Background="#16161A" BorderBrush="#2A2A30" BorderThickness="0,0,1,0">
      <StackPanel Margin="0,8">
        <TextBlock Text="시스템 설정" Foreground="#E8E8EC" FontSize="13" FontWeight="SemiBold" Margin="14,8,14,6"/>
        <TextBlock Text="장비 관리"          Foreground="#9A9AA2" FontSize="13" Padding="30,6,14,6"/>
        <TextBlock Text="이벤트 정의"        Foreground="#9A9AA2" FontSize="13" Padding="30,6,14,6"/>
        <TextBlock Text="스케줄 정의"        Foreground="#9A9AA2" FontSize="13" Padding="30,6,14,6"/>
        <TextBlock Text="계정 관리"          Foreground="#9A9AA2" FontSize="13" Padding="30,6,14,6"/>
        <Border Background="#1E2D47" BorderBrush="#1751D9" BorderThickness="2,0,0,0">
          <TextBlock Text="권한 설정"        Foreground="#FFFFFF"  FontSize="13" FontWeight="SemiBold" Padding="28,6,14,6"/>
        </Border>
        <TextBlock Text="데이터 보관기간 설정" Foreground="#9A9AA2" FontSize="13" Padding="30,6,14,6"/>
        <TextBlock Text="이벤트 관리"        Foreground="#9A9AA2" FontSize="13" Padding="30,6,14,6"/>
        <TextBlock Text="환경 설정" Foreground="#E8E8EC" FontSize="13" FontWeight="SemiBold" Margin="14,12,14,6"/>
        <TextBlock Text="알림 설정"          Foreground="#9A9AA2" FontSize="13" Padding="30,6,14,6"/>
        <TextBlock Text="정보" Foreground="#E8E8EC" FontSize="13" FontWeight="SemiBold" Margin="14,12,14,6"/>
        <TextBlock Text="프로그램 정보"      Foreground="#9A9AA2" FontSize="13" Padding="30,6,14,6"/>
      </StackPanel>
    </Border>

    <!-- 권한 설정 본문 -->
    <Grid Grid.Column="1" Margin="16">
      <Grid.RowDefinitions>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="Auto"/>
        <RowDefinition Height="*"/>
        <RowDefinition Height="Auto"/>
      </Grid.RowDefinitions>

      <!-- 페이지 헤더 -->
      <StackPanel Grid.Row="0" Margin="0,0,0,12">
        <TextBlock Text="권한 설정" Foreground="#FFFFFF" FontSize="20" FontWeight="Bold" LineHeight="28"/>
        <TextBlock Text="등급별 메뉴 접근 권한을 설정합니다. Super Admin은 모든 권한을 가집니다."
                   Foreground="#6A6A72" FontSize="12" LineHeight="16" Margin="0,2,0,0"/>
      </StackPanel>

      <!-- 등급 범례 -->
      <StackPanel Grid.Row="1" Orientation="Horizontal" Margin="0,0,0,12" >
        <StackPanel Orientation="Horizontal" Margin="0,0,16,0">
          <Border Width="10" Height="10" Background="#3A3A50" BorderBrush="#4A4A5A" BorderThickness="1" CornerRadius="2" VerticalAlignment="Center"/>
          <TextBlock Text="사용자 (User)"     Foreground="#9A9AA2" FontSize="12" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <StackPanel Orientation="Horizontal" Margin="0,0,16,0">
          <Border Width="10" Height="10" Background="#2A3A52" BorderBrush="#4A4A5A" BorderThickness="1" CornerRadius="2" VerticalAlignment="Center"/>
          <TextBlock Text="관리자 (Manager)"  Foreground="#9A9AA2" FontSize="12" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
        <StackPanel Orientation="Horizontal">
          <Border Width="10" Height="10" Background="#1A2A42" BorderBrush="#4A4A5A" BorderThickness="1" CornerRadius="2" VerticalAlignment="Center"/>
          <TextBlock Text="상위관리자 (Admin)" Foreground="#9A9AA2" FontSize="12" Margin="6,0,0,0" VerticalAlignment="Center"/>
        </StackPanel>
      </StackPanel>

      <!-- 권한 매트릭스 -->
      <Border Grid.Row="2" Background="#16161A" BorderBrush="#2A2A30" BorderThickness="1" CornerRadius="6">
        <Grid>
          <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
          </Grid.RowDefinitions>
          <Border Grid.Row="0" BorderBrush="#2A2A30" BorderThickness="0,0,0,1" Padding="12,8">
            <TextBlock Text="메뉴 권한 매트릭스" Foreground="#FFFFFF" FontSize="14" FontWeight="Bold"/>
          </Border>
          <DataGrid Grid.Row="1" AutoGenerateColumns="False" CanUserAddRows="False"
                    CanUserDeleteRows="False" CanUserResizeRows="False"
                    GridLinesVisibility="None" HeadersVisibility="Column"
                    Background="Transparent" RowBackground="Transparent"
                    AlternatingRowBackground="Transparent"
                    BorderThickness="0" SelectionMode="Single">
            <DataGrid.Columns>
              <DataGridTextColumn Header="메뉴 / 기능명" Binding="{{Binding Label}}" Width="*"/>
              <DataGridCheckBoxColumn Header="사용자&#x0a;User"     Binding="{{Binding User}}"  Width="88"/>
              <DataGridCheckBoxColumn Header="관리자&#x0a;Manager"  Binding="{{Binding Mgr}}"   Width="88"/>
              <DataGridCheckBoxColumn Header="상위관리자&#x0a;Admin" Binding="{{Binding Admin}}" Width="100"/>
            </DataGrid.Columns>
            <DataGrid.Items>
${rows}
            </DataGrid.Items>
          </DataGrid>
        </Grid>
      </Border>

      <!-- 하단 버튼 -->
      <StackPanel Grid.Row="3" Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,12,0,0">
        <Button Content="취소" Background="Transparent" Foreground="#C4C4CC"
                BorderBrush="#3A3A42" BorderThickness="1" Padding="16,6" Margin="0,0,8,0"
                FontSize="14" FontWeight="Medium"/>
        <Button Content="저장" Background="#1751D9" Foreground="#FFFFFF"
                BorderThickness="0" Padding="20,6"
                FontSize="14" FontWeight="SemiBold"/>
      </StackPanel>
    </Grid>
  </Grid>
</UserControl>`;
}

export default function PrevaxPermissionScreen() {
  const nav = [
    { sec: '시스템 설정', items: ['장비 관리', '이벤트 정의', '스케줄 정의', '계정 관리', '권한 설정', '데이터 보관기간 설정', '이벤트 관리'] },
    { sec: '환경 설정',   items: ['알림 설정'] },
    { sec: '정보',        items: ['프로그램 정보'] },
  ];
  const [navSel, setNavSel] = useState('권한 설정');

  const [perms, setPerms] = useState(() => {
    const m = {};
    PERM_ROWS.forEach((r) => { m[r.id] = { user: r.user, mgr: r.mgr, admin: r.admin }; });
    return m;
  });
  const [dirty, setDirty] = useState(false);

  const toggle = (id, grade) => {
    setPerms((prev) => ({ ...prev, [id]: { ...prev[id], [grade]: !prev[id][grade] } }));
    setDirty(true);
  };

  const panel = { background: '#16161a', border: '1px solid #2a2a30', borderRadius: '6px', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' };
  const panelHead = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px 12px', borderBottom: '1px solid #2a2a30' };

  const PCell = ({ id, grade }) => {
    const checked = perms[id]?.[grade] ?? false;
    return (
      <td style={{ textAlign: 'center', padding: '0', borderBottom: '1px solid #232329' }}>
        <div
          onClick={() => toggle(id, grade)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '16px', height: '16px', borderRadius: '3px', cursor: 'pointer',
            border: `1.5px solid ${checked ? T.primary : '#4a4a52'}`,
            background: checked ? T.primary : 'transparent',
            transition: 'all 0.12s',
          }}
        >
          {checked && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 5.2L4.2 7.4L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </td>
    );
  };

  const rowBg = (kind) => {
    if (kind === 'main') return 'rgba(23,81,217,0.08)';
    if (kind === 'menu') return 'rgba(255,255,255,0.03)';
    return 'transparent';
  };

  const RowLabel = ({ row }) => {
    const indent = row.depth * 16;
    const dot = row.kind === 'menu'
      ? <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: '#5a5a6a', marginRight: '6px', flexShrink: 0 }} />
      : row.kind === 'item'
      ? <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: '#3a3a4a', marginRight: '6px', flexShrink: 0 }} />
      : null;
    return (
      <td style={{
        paddingLeft: `${12 + indent}px`, paddingRight: '8px', paddingTop: '6px', paddingBottom: '6px',
        borderBottom: '1px solid #232329',
        ...TYPE.caption1,
        fontWeight: row.kind === 'main' ? W.semibold : row.kind === 'menu' ? W.medium : W.regular,
        color: row.kind === 'main' ? '#e8e8ec' : row.kind === 'menu' ? '#c4c4cc' : '#9a9aa2',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>{dot}{row.label}</span>
      </td>
    );
  };

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      <PrevaxTitleBar datetime="2026-06-11 10:24:38" />
      <PrevaxTabBar active="설정" />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* 설정 네비 */}
        <div style={{ width: '186px', flexShrink: 0, background: '#16161a', borderRight: '1px solid #2a2a30', overflowY: 'auto', padding: '8px 0' }}>
          {nav.map((g) => (
            <div key={g.sec} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px 6px', ...TYPE.label2, fontWeight: W.semibold, color: '#e8e8ec' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: T.primary }} />
                {g.sec}
              </div>
              {g.items.map((it) => {
                const on = navSel === it;
                return (
                  <div key={it} onClick={() => setNavSel(it)} style={{
                    padding: '6px 14px 6px 30px', ...TYPE.label2, cursor: 'pointer',
                    background: on ? 'rgba(23,81,217,0.18)' : 'transparent',
                    borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                    color: on ? '#fff' : '#9a9aa2', fontWeight: on ? W.semibold : W.regular,
                  }}>{it}</div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 권한 설정 인라인 페이지 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>

          {/* 페이지 헤더 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <div style={{ ...TYPE.heading2, fontWeight: W.bold, color: '#fff' }}>권한 설정</div>
              <div style={{ ...TYPE.caption1, color: '#6a6a72', marginTop: '2px' }}>
                등급별 메뉴 접근 권한을 설정합니다. Super Admin은 모든 권한을 가집니다.
              </div>
            </div>
            {dirty && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', ...TYPE.caption1, color: T.cautionary }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke="#FFA938"/>
                  <path d="M6 3.5V6.5M6 8h.01" stroke="#FFA938" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                저장되지 않은 변경이 있습니다
              </div>
            )}
          </div>

          {/* 등급 범례 */}
          <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
            {[
              { label: '사용자 (User)',        color: '#3a3a50' },
              { label: '관리자 (Manager)',      color: '#2a3a52' },
              { label: '상위관리자 (Admin)',    color: '#1a2a42' },
            ].map((g) => (
              <div key={g.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: g.color, border: '1px solid #4a4a5a' }} />
                <span style={{ ...TYPE.caption1, color: '#9a9aa2' }}>{g.label}</span>
              </div>
            ))}
          </div>

          {/* 권한 매트릭스 */}
          <div style={{ ...panel, flex: 1, minHeight: 0 }}>
            <div style={panelHead}>
              <span style={{ ...TYPE.label1, fontWeight: W.bold, color: '#fff' }}>메뉴 권한 매트릭스</span>
              <span style={{ ...TYPE.caption1, color: '#6a6a72' }}>
                총 {PERM_ROWS.length}개 항목
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }} className="prevax-scroll">
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: 'auto' }} />
                  <col style={{ width: '88px' }} />
                  <col style={{ width: '88px' }} />
                  <col style={{ width: '100px' }} />
                </colgroup>
                <thead>
                  <tr>
                    {['메뉴 / 기능명', '사용자', '관리자', '상위관리자'].map((h, i) => (
                      <th key={h} style={{
                        ...TYPE.caption1, fontWeight: W.semibold,
                        color: i === 0 ? '#8a8a92' : '#a0b0d0',
                        textAlign: i === 0 ? 'left' : 'center',
                        padding: i === 0 ? '7px 8px 7px 12px' : '7px 0',
                        borderBottom: '1px solid #2a2a30',
                        position: 'sticky', top: 0,
                        background: i === 1 ? 'rgba(58,58,80,0.6)' : i === 2 ? 'rgba(42,58,82,0.6)' : i === 3 ? 'rgba(26,42,66,0.6)' : '#16161a',
                      }}>
                        {h}
                        {i > 0 && (
                          <div style={{ ...TYPE.caption2, color: '#5a6a7a', fontWeight: W.regular, marginTop: '1px' }}>
                            {i === 1 ? 'User' : i === 2 ? 'Manager' : 'Admin'}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERM_ROWS.map((row) => (
                    <tr key={row.id} style={{ background: rowBg(row.kind) }}>
                      <RowLabel row={row} />
                      <PCell id={row.id} grade="user" />
                      <PCell id={row.id} grade="mgr" />
                      <PCell id={row.id} grade="admin" />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flexShrink: 0 }}>
            <div style={{ flex: 1, ...TYPE.caption1, color: '#5a5a62' }}>
              * 변경 저장 시 본인 등급의 권한이 바뀐 경우 재로그인이 필요합니다.
            </div>
            <button
              onClick={() => setDirty(false)}
              style={{
                padding: '6px 16px', borderRadius: '5px', border: '1px solid #3a3a42',
                background: 'transparent', color: '#c4c4cc', cursor: 'pointer',
                ...TYPE.label1, fontWeight: W.medium,
              }}
            >취소</button>
            <button
              onClick={() => setDirty(false)}
              style={{
                padding: '6px 20px', borderRadius: '5px', border: 'none',
                background: dirty ? T.primary : '#2a2a36',
                color: dirty ? '#fff' : '#5a5a6a', cursor: dirty ? 'pointer' : 'default',
                ...TYPE.label1, fontWeight: W.semibold,
                transition: 'background 0.15s',
              }}
            >저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
