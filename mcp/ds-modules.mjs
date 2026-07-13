/**
 * 정본 컴포넌트 id → src/ds 모듈 파일명 (단일 출처).
 * gen-component-code.mjs(소스 문자열)와 gen-component-props.mjs(AST prop 추출)가 공유합니다.
 * 새 정본 컴포넌트를 src/ds 에 추가하면 이 맵에만 등록하면 두 생성기가 함께 처리합니다.
 */
export const DS_MODULES = {
  'control-checkbox': 'Checkbox.jsx',
  'filter-button-default': 'FilterButton.jsx',
  'control-datepicker': 'DateField.jsx',
  'table-default': 'DataTable.jsx',
  'present-menu': 'ContextMenu.jsx',
  'section-header-default': 'SectionHeader.jsx',
  'loading-default': 'Loading.jsx',
};
