import { useState } from 'react';
import { PrevaxTitleBar, PrevaxTabBar } from './Library';
import { Icon } from './icons';
import { T, W, TYPE, SEM } from '../data/tokens';

// 디자인 토큰은 src/data/tokens.js 단일 출처에서 import (Primary 계열 #0066FF 확정).

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
      `${indent(5)}<DataGridCell/>`,
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
      <Setter Property="Foreground" Value="${T.primary}"/>
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
        <Border Background="#1E2D47" BorderBrush="${T.primary}" BorderThickness="2,0,0,0">
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
              <DataGridTextColumn Header="메뉴 / 기능명" Binding="{{Binding Label}}" Width="320"/>
              <DataGridCheckBoxColumn Header="사용자&#x0a;User"     Binding="{{Binding User}}"  Width="88"/>
              <DataGridCheckBoxColumn Header="관리자&#x0a;Manager"  Binding="{{Binding Mgr}}"   Width="88"/>
              <DataGridCheckBoxColumn Header="상위관리자&#x0a;Admin" Binding="{{Binding Admin}}" Width="100"/>
              <!-- 우측 여백 spacer 컬럼 — 남는 가로 폭 흡수(라벨 옆 체크박스 정렬 유지) -->
              <DataGridTextColumn Header="" Width="*" IsReadOnly="True"/>
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
        <Button Content="저장" Background="${T.primary}" Foreground="#FFFFFF"
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
  const [hoverId, setHoverId] = useState(null);

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
        <span
          onClick={() => toggle(id, grade)}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <span style={{ width: '13px', height: '13px', borderRadius: '3px', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${checked ? T.primary : '#33333b'}`, background: checked ? T.primary : '#141417' }}>
            {checked && (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
            )}
          </span>
        </span>
      </td>
    );
  };

  const rowBg = (kind) => {
    if (kind === 'main') return 'rgba(0, 102, 255,0.08)';
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
      <PrevaxTitleBar datetime="2026.06.11 10:24:38" />
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
                    background: on ? 'rgba(0, 102, 255,0.18)' : 'transparent',
                    borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                    color: on ? SEM.label.strong : '#9a9aa2', fontWeight: on ? W.semibold : W.regular,
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
              <div style={{ ...TYPE.heading2, fontWeight: W.bold, color: SEM.label.strong }}>권한 설정</div>
              <div style={{ ...TYPE.caption1, color: '#6a6a72', marginTop: '2px' }}>
                등급별 메뉴 접근 권한을 설정합니다. Super Admin은 모든 권한을 가집니다.
              </div>
            </div>
            {dirty && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', ...TYPE.caption1, color: T.cautionary }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.5" stroke={SEM.status.cautionary}/>
                  <path d="M6 3.5V6.5M6 8h.01" stroke={SEM.status.cautionary} strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                저장되지 않은 변경이 있습니다
              </div>
            )}
          </div>

          {/* 등급 범례 */}
          <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
            {[
              { label: '사용자',        color: '#3a3a50' },
              { label: '관리자',        color: '#2a3a52' },
              { label: '상위관리자',    color: '#1a2a42' },
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
              <span style={{ ...TYPE.label1, fontWeight: W.bold, color: SEM.label.strong }}>메뉴 권한 매트릭스</span>
              <span style={{ ...TYPE.caption1, color: '#6a6a72' }}>
                총 {PERM_ROWS.length}개 항목
              </span>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }} className="prevax-scroll">
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '320px' }} />
                  <col style={{ width: '88px' }} />
                  <col style={{ width: '88px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: 'auto' }} />
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
                        position: 'sticky', top: 0, zIndex: 2,
                        // 불투명 배경(반투명이면 스크롤되는 체크박스 행이 헤더 뒤로 비침) — 기존 색감을 #16161a 위 합성한 불투명값으로
                        background: i === 1 ? '#2c2c3a' : i === 2 ? '#222c3c' : i === 3 ? '#182232' : '#16161a',
                      }}>
                        {h}
                      </th>
                    ))}
                    {/* 우측 여백 spacer 헤더 — 남는 가로 폭 흡수 */}
                    <th style={{
                      borderBottom: '1px solid #2a2a30',
                      position: 'sticky', top: 0, zIndex: 2, background: '#16161a',
                    }} />
                  </tr>
                </thead>
                <tbody>
                  {PERM_ROWS.map((row) => {
                    const hovered = hoverId === row.id;
                    const base = rowBg(row.kind);
                    // 행 hover: 기존 rowBg 위에 은은한 강조 톤을 덧입힘(미묘한 화이트 오버레이)
                    const bg = hovered
                      ? `linear-gradient(rgba(255,255,255,0.04), rgba(255,255,255,0.04)), ${base === 'transparent' ? 'rgba(0,0,0,0)' : base}`
                      : base;
                    return (
                      <tr
                        key={row.id}
                        onMouseEnter={() => setHoverId(row.id)}
                        onMouseLeave={() => setHoverId(null)}
                        style={{ background: bg }}
                      >
                        <RowLabel row={row} />
                        <PCell id={row.id} grade="user" />
                        <PCell id={row.id} grade="mgr" />
                        <PCell id={row.id} grade="admin" />
                        {/* 우측 여백 spacer 셀 — 하단 구분선만 유지 */}
                        <td style={{ borderBottom: '1px solid #232329' }} />
                      </tr>
                    );
                  })}
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
                color: dirty ? SEM.label.strong : '#5a5a6a', cursor: dirty ? 'pointer' : 'default',
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

// ─── Settings(권한 설정) 2 — DevExpress 적용 경계 표기 버전 ──────────────────
// 같은 권한 설정 화면 위에 "토큰 적용 / DevExpress 근사 / 제외(테마 DLL·크롬)" 경계를
// 영역별 점선 테두리 + 코너 태그 + 범례로 시각화한 개발 인계용 변형.
const BND = {
  apply:  { color: SEM.status.positive,   label: '적용',  desc: '토큰 직접 적용 (테마 키 없는 커스텀 영역)' },
  approx: { color: SEM.status.cautionary, label: '근사',  desc: 'DevExpress 컨트롤로 근사 (GridControl·CheckEdit·SimpleButton)' },
  exclude:{ color: SEM.status.negative,   label: '제외',  desc: 'DevExpress 기본 테마/네이티브 — 토큰 못 덮음(PintelTheme DLL)' },
};

// 정밀 매핑 — 영역별 번호 콜아웃 + 우측 표(영역·DevExpress 타깃·시맨틱 토큰·경계·근거).
//  ctrl=DevExpress 컨트롤, target=XAML 스타일/리소스 타깃, token=소비할 시맨틱 토큰 슬롯.
//  근거: jsx-to-xaml-workflow §5 매핑 · §2-2 PintelTheme DLL · 본 화면 generateXaml 리소스(DataGridColumnHeader/DataGridCell/CheckBox).
const BND_MAP = [
  { n: 1, kind: 'exclude', region: '타이틀바 · 탭 크롬', ctrl: 'dx:ThemedWindow / TabControl', target: 'PintelTheme(DLL)', token: '—', note: '편집 불가 DLL 내장 테마 — 시맨틱 토큰으로 못 덮음(D-1: 전역 정책 오너 결정)' },
  { n: 2, kind: 'apply',   region: '설정 네비 패널', ctrl: 'Border › ScrollViewer › StackPanel', target: 'Border.Background / BorderBrush', token: 'background.elevatedNormal · line.normalNeutral · label.normal', note: '패널 배경·구분선·텍스트=토큰 직접. 선택 항목 강조=primary.normal' },
  { n: 2.1, kind: 'approx', region: '└ 네비 항목 버튼', ctrl: 'dx:SimpleButton (GroupName/Checked)', target: 'SimpleButton Style', token: 'label.normal · fill.normal', note: '항목 자체는 SimpleButton 근사(IsChecked 트리거로 선택 강조)' },
  { n: 3, kind: 'apply',   region: '페이지 헤더 · 설명', ctrl: 'TextBlock', target: 'TextBlock', token: 'label.strong(제목) · label.assistive(설명)', note: 'Typography(heading2/caption1) + label 토큰 직접' },
  { n: 4, kind: 'approx',  region: '권한 매트릭스', ctrl: 'dxg:GridControl + TableView', target: '—', token: '—', note: '혼합 — 아래 4a~4d로 분해' },
  { n: '4a', kind: 'apply',   region: '└ 컬럼 헤더', ctrl: 'DataGridColumnHeader', target: 'DataGridColumnHeader Style', token: 'background.normalNormal · label.neutral · line.normalNormal', note: 'generateXaml에 이미 정의된 스타일 — 토큰으로 치환 가능' },
  { n: '4b', kind: 'apply',   region: '└ 셀 텍스트·들여쓰기', ctrl: 'DataGridCell › CellTemplate TextBlock', target: 'DataGridCell Style', token: 'label.normal/neutral · line.normalNeutral', note: '깊이별 색/들여쓰기=토큰. 셀 보더=line 토큰' },
  { n: '4c', kind: 'approx',  region: '└ 행 배경 tint(main/menu)', ctrl: 'RowStyle DataTrigger', target: 'DataGridRow.Background', token: 'fill.normal · primary(tint)', note: 'kind별 tint는 DataTrigger로 근사' },
  { n: '4d', kind: 'exclude', region: '└ 정렬 글리프·호버·선택·스크롤바', ctrl: 'TableView 내장', target: 'PintelTheme(DLL)', token: '—', note: '정렬 화살표·행 호버·선택 하이라이트·스크롤바=DevExpress 기본 테마(못 덮음)' },
  // eslint-disable-next-line pintel/prefer-color-token -- 토큰 매핑 설명 문자열: 어떤 토큰(값)에 대응하는지 표기가 목적
  { n: 5, kind: 'approx',  region: '체크박스 셀', ctrl: 'dxe:CheckEditSettings', target: 'CheckBox Style (Foreground)', token: 'primary.normal(#0066FF)', note: '체크 색만 토큰. 박스 외형은 DevExpress 기본(근사)' },
  { n: 6, kind: 'approx',  region: '하단 버튼(취소/저장)', ctrl: 'dx:SimpleButton (IsCancel/IsDefault)', target: 'SimpleButton Style', token: 'primary.normal(저장) · line.solidNormal(취소 보더) · label', note: '저장=primary 채움, 취소=보더+label. 컨트롤 외형 근사' },
];

export function PrevaxPermissionScreen2() {
  const rows = PERM_ROWS;
  const grade = ['사용자', '관리자', '상위관리자'];

  // 경계 표기 래퍼: 점선 테두리 + 좌상단 번호 콜아웃
  const Region = ({ n, kind, children, style }) => {
    const b = BND[kind];
    return (
      <div style={{ position: 'relative', border: `1px dashed ${b.color}`, borderRadius: '6px', ...style }}>
        <span style={{
          position: 'absolute', top: '-10px', left: '8px', zIndex: 3,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '18px', height: '18px', borderRadius: '50%',
          background: b.color, color: '#0d0d0d',
          fontSize: '11px', fontWeight: 800, fontFamily: T.font,
        }}>{n}</span>
        {children}
      </div>
    );
  };

  const rowBg = (kind) => kind === 'main' ? 'rgba(0,102,255,0.08)' : kind === 'menu' ? 'rgba(255,255,255,0.03)' : 'transparent';

  return (
    <div style={{
      width: '100%', maxWidth: '1920px', aspectRatio: '16 / 9',
      display: 'flex', flexDirection: 'column',
      background: '#1a1a1f', border: '1px solid #2a2a30', borderRadius: '10px',
      overflow: 'hidden', fontFamily: T.font, color: '#e8e8ec', boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
    }}>
      {/* ① 크롬(타이틀바·탭) = 제외 */}
      <Region n={1} kind="exclude" style={{ border: 'none', borderBottom: `1px dashed ${SEM.status.negative}`, borderRadius: 0 }}>
        <PrevaxTitleBar datetime="2026.06.17 10:24:38" />
        <PrevaxTabBar active="설정" />
      </Region>

      <div style={{ flex: 1, display: 'flex', minHeight: 0, padding: '12px 10px 10px', gap: '12px' }}>
        {/* 좌: 실제 화면 (번호 콜아웃) */}
        <div style={{ flex: 1, display: 'flex', minWidth: 0, minHeight: 0, gap: '10px' }}>
          {/* ② 설정 네비 = 적용 */}
          <Region n={2} kind="apply" style={{ width: '180px', flexShrink: 0, overflow: 'hidden' }}>
            <div style={{ background: '#16161a', height: '100%', overflowY: 'auto', padding: '8px 0' }}>
              {[
                { sec: '시스템 설정', items: ['장비 관리', '이벤트 정의', '계정 관리', '권한 설정', '데이터 보관기간 설정'] },
                { sec: '환경 설정', items: ['알림 설정'] },
              ].map((g) => (
                <div key={g.sec} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px 6px', ...TYPE.label2, fontWeight: W.semibold, color: '#e8e8ec' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: T.primary }} />{g.sec}
                  </div>
                  {g.items.map((it) => {
                    const on = it === '권한 설정';
                    return (
                      <div key={it} style={{
                        padding: '6px 14px 6px 30px', ...TYPE.label2,
                        background: on ? 'rgba(0,102,255,0.18)' : 'transparent',
                        borderLeft: `2px solid ${on ? T.primary : 'transparent'}`,
                        color: on ? SEM.label.strong : '#9a9aa2', fontWeight: on ? W.semibold : W.regular,
                      }}>{it}</div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Region>

          {/* 본문 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0, minHeight: 0 }}>
            {/* ③ 헤더+등급 범례 = 적용 */}
            <Region n={3} kind="apply" style={{ flexShrink: 0 }}>
              <div style={{ padding: '12px' }}>
                <div style={{ ...TYPE.heading2, fontWeight: W.bold, color: SEM.label.strong }}>권한 설정</div>
                <div style={{ ...TYPE.caption1, color: '#6a6a72', marginTop: '2px' }}>등급별 메뉴 접근 권한을 설정합니다.</div>
              </div>
            </Region>

            {/* ④ 매트릭스 = 근사(구조) + 적용(셀 토큰) + 제외(내장 테마) */}
            <Region n={4} kind="approx" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div style={{ background: '#16161a', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #2a2a30', ...TYPE.label1, fontWeight: W.bold, color: SEM.label.strong }}>메뉴 권한 매트릭스</div>
                <div style={{ flex: 1, overflowY: 'auto' }} className="prevax-scroll">
                  <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                    <colgroup><col /><col style={{ width: '72px' }} /><col style={{ width: '72px' }} /><col style={{ width: '86px' }} /></colgroup>
                    <thead><tr>
                      {['메뉴 / 기능명', ...grade].map((h, i) => (
                        <th key={h} style={{ ...TYPE.caption1, fontWeight: W.semibold, color: i === 0 ? '#8a8a92' : '#a0b0d0', textAlign: i === 0 ? 'left' : 'center', padding: i === 0 ? '7px 8px 7px 12px' : '7px 0', borderBottom: '1px solid #2a2a30', position: 'sticky', top: 0, zIndex: 2, background: '#16161a' }}>
                          {h}{i === 1 && (
                            <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: BND.approx.color, color: '#0d0d0d', fontSize: '10px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>5</span>
                          )}
                        </th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.id} style={{ background: rowBg(r.kind) }}>
                          <td style={{ paddingLeft: `${12 + r.depth * 16}px`, paddingRight: '8px', paddingTop: '6px', paddingBottom: '6px', borderBottom: '1px solid #232329', ...TYPE.caption1, fontWeight: r.kind === 'main' ? W.semibold : W.regular, color: r.kind === 'main' ? '#e8e8ec' : r.kind === 'menu' ? '#c4c4cc' : '#9a9aa2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</td>
                          {['user', 'mgr', 'admin'].map((g) => (
                            <td key={g} style={{ textAlign: 'center', padding: '4px 0', borderBottom: '1px solid #232329' }}>
                              <Icon name={r[g] ? 'check_on' : 'check_off'} size={16} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Region>

            {/* ⑥ 하단 버튼 = 근사 */}
            <Region n={6} kind="approx" style={{ flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '8px 12px' }}>
                <button type="button" style={{ padding: '6px 16px', borderRadius: '5px', border: '1px solid #3a3a42', background: 'transparent', color: '#c4c4cc', ...TYPE.label1, fontWeight: W.medium }}>취소</button>
                <button type="button" style={{ padding: '6px 20px', borderRadius: '5px', border: 'none', background: T.primary, color: SEM.label.strong, ...TYPE.label1, fontWeight: W.semibold }}>저장</button>
              </div>
            </Region>
          </div>
        </div>

        {/* 우: 경계 매핑표 */}
        <div style={{ width: '340px', flexShrink: 0, background: '#16161a', border: '1px solid #2a2a30', borderRadius: '8px', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '12px 14px 8px' }}>
            <div style={{ ...TYPE.label1, fontWeight: W.bold, color: SEM.label.strong }}>DevExpress 적용 경계</div>
            <div style={{ ...TYPE.caption2, color: '#6a6a72', marginTop: '2px' }}>근거: jsx-to-xaml-workflow §5 매핑 · §2-2 PintelTheme DLL</div>
          </div>
          {/* 범주 범례 */}
          <div style={{ display: 'flex', gap: '12px', padding: '0 14px 10px', flexWrap: 'wrap' }}>
            {Object.values(BND).map((b) => (
              <span key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', ...TYPE.caption2, color: '#bdbdc4' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: b.color }} /><b style={{ color: b.color }}>{b.label}</b>
              </span>
            ))}
          </div>
          {/* 매핑 행 */}
          <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid #232329' }} className="prevax-scroll">
            {BND_MAP.map((m) => {
              const b = BND[m.kind];
              const sub = String(m.n).length > 1; // '2.1','4a'… = 세부 행(들여쓰기)
              return (
                <div key={m.n} style={{ display: 'flex', gap: '8px', padding: sub ? '7px 14px 7px 26px' : '10px 14px', borderBottom: '1px solid #232329', background: sub ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                  <span style={{ flexShrink: 0, width: sub ? '16px' : '18px', height: sub ? '16px' : '18px', borderRadius: '50%', background: b.color, color: '#0d0d0d', fontSize: sub ? '9px' : '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{m.n}</span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ ...TYPE.caption1, fontWeight: W.semibold, color: '#e8e8ec' }}>{m.region}</span>
                      <span style={{ ...TYPE.caption2, fontWeight: W.bold, color: b.color }}>{b.label}</span>
                    </div>
                    <div style={{ ...TYPE.caption2, color: '#8a8a92', marginTop: '3px' }}>
                      <span style={{ color: '#6a6a72' }}>컨트롤 </span><span style={{ fontFamily: 'monospace', color: '#a0b0d0' }}>{m.ctrl}</span>
                    </div>
                    {m.target && m.target !== '—' && (
                      <div style={{ ...TYPE.caption2, color: '#8a8a92', marginTop: '1px' }}>
                        <span style={{ color: '#6a6a72' }}>타깃 </span><span style={{ fontFamily: 'monospace', color: '#8a92a0' }}>{m.target}</span>
                      </div>
                    )}
                    {m.token && m.token !== '—' && (
                      <div style={{ ...TYPE.caption2, color: '#8a8a92', marginTop: '1px' }}>
                        <span style={{ color: '#6a6a72' }}>토큰 </span><span style={{ fontFamily: 'monospace', color: '#7faf8a' }}>{m.token}</span>
                      </div>
                    )}
                    <div style={{ ...TYPE.caption2, color: '#6a6a72', marginTop: '3px' }}>{m.note}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ padding: '10px 14px', ...TYPE.caption2, color: '#6a6a72', lineHeight: 1.5 }}>
              + 공통: letter-spacing은 WPF 등가 부재(제외/근사) · 그림자=shadow 토큰 가능하나 관제 저우선 · 애니메이션 선택적(eval 판정).<br />
              경계 근거: jsx-to-xaml-workflow §5 · §2-2 · 본 화면 generateXaml 리소스.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
