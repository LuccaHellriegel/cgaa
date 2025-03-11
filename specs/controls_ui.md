# Controls and UI

## Movement Controls

- **Keys**: WASD
- **Functionality**: Move the player character in all four directions
- **Design Consideration**: Direct control allows for action gameplay alongside tower defense
- **Visual Feedback**: Movement animation should play when player is moving

## Combat and Interaction Modes

- **Mode Switching**: F key toggles between attack and interaction modes
- **Indication**:
  - Clear visual feedback to show current mode
  - Mode indicator should display both current mode AND alternative mode
  - Position mode indicator in a non-intrusive location that doesn't obscure gameplay
  - Use consistent color coding: red for attack mode, blue for interaction mode

### Attack Mode

- **Action**: Left-click
- **Functionality**: Attack enemies directly
- **Visual Feedback**:
  - Attack animation playing
  - Cursor should change to indicate attack capability
  - Highlight potential targets when hovering

### Interaction Mode

- **Action**: Left-click
- **Functionality**:
  - Click on build menu to select towers
  - Click on ground to place selected tower
  - Click on tower to open tower menu
  - Click on diplomat to open diplomat menu
- **Visual Feedback**:
  - Appropriate UI elements appear when clicking on interactive objects
  - Cursor should change to indicate interaction capability
  - Highlight interactive elements when hovering

## Player Status UI

- **Health Bar**:
  - Clearly visible health bar attached to player character
  - Changes color based on health percentage (green > yellow > red)
  - Numeric display of current/max health
- **Status Effects**:
  - Visual indicators for any status effects on player
  - Countdown timer for temporary effects

## Build System UI

- **Activation**: Accessible in interaction mode
- **Components**:
  - Tower selection buttons with distinctive icons and visual previews
  - Soul counter display positioned prominently on screen
  - Tower cost indicators with visual comparison to current soul count
  - Tooltips showing tower statistics and descriptions
- **Functionality**:
  - Select tower types for building
  - Display current soul count
  - Visual feedback when insufficient souls (grayed out options)
  - Preview of tower placement before confirming

## Tower Menu UI

- **Activation**: Click on tower in interaction mode
- **Components**:
  - Sell button
  - Tower information with visual statistics
  - Upgrade options with cost/benefit visualization
  - Range indicator
- **Functionality**:
  - Allows selling towers for repositioning
  - Shows tower effectiveness statistics
  - Displays current attack range as a circle

## Diplomat Menu UI

- **Activation**: Click on diplomat in interaction mode
- **Components**:
  - Quest acceptance button
  - Quest status display with progress indicators
  - Target selection for cooperating camps with visual map
  - Reward preview
- **Functionality**:
  - Accept quests from diplomats
  - Check quest status
  - Direct cooperating camps to attack specific targets

## Game Status UI

- **Camp Status Indicators**:
  - White arrow: Currently spawning wave
  - Red marking: Current quest target
  - Big X: Destroyed camp
  - "C" symbol: Cooperating camp
  - Colored arrow: Target direction for cooperating camp's waves
- **Wave Indicator**:
  - Current wave number
  - Timer until next wave
  - Difficulty indicator
- **Objective Markers**:
  - Clear directional indicators for current objectives
  - Distance indicators for off-screen objectives

## Soul Counter UI

- **Display**:
  - Shows current soul count prominently
  - Includes visual representation (soul icon)
  - Positioned consistently in UI layout
- **Updates**:
  - In real-time as souls are gained and spent
  - Animated counter increments/decrements
- **Visual Feedback**:
  - Highlighting when gaining souls
  - Warning flash when spending reduces below threshold

## Navigation Aids

- **Minimap**:
  - Small map in corner showing key locations
  - Player position clearly marked
  - Enemy positions indicated
  - Camp locations highlighted
- **Directional Indicators**:
  - Arrows pointing to important off-screen events or objectives
  - Color-coded based on type (enemy, quest, ally)

## Visual Distinction of Game Elements

- **Player Character**:
  - Distinctive sprite with clear directional indication
  - Visual differentiation from other units
  - Clear highlight or outline
- **Enemy Units**:
  - Visually distinct based on type and threat level
  - Size proportional to strength
  - Clear health indicators
- **Camps**:
  - Visually distinct structures with clear status indicators
  - Different appearances based on alignment (hostile, neutral, friendly)
- **Towers**:
  - Distinctive designs based on type and function
  - Visual upgrade states
  - Active/inactive status indicators

## UI Design Considerations

- Based on user testing, moved from mode-based keyboard controls to a more intuitive click-based interface
- Follows RTS (Real-Time Strategy) conventions for unit selection and building
- Selection bars appear when a unit is selected, providing interaction options
- Mode-switching is minimized but still required for separating attack and interaction functionality
- Consistent color coding across all UI elements
- Scalable UI that works across different screen resolutions

## UI Transition History

- **Initial Design**: Heavy reliance on keyboard modes (similar to "Orcs Must Die!")
- **Testing Feedback**: Users found the mode system confusing
- **Research Insight**: Research on UI design principles suggested mode-based interfaces are mainly effective for expert users
- **Current Design**: Click-based interface with minimal mode switching, following RTS conventions that aligned with user expectations
- **Ongoing Improvements**: Enhanced visual feedback and clearer distinctions between game elements based on playtester feedback
