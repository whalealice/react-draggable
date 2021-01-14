const {ReactDraggable: Draggable, React, ReactDOM} = window;

class App extends React.Component {
  state = {
    activeDrags: 0,
    deltaPosition: {
      x: 0, y: 0
    },
    controlledPosition: {
      x: -400, y: 200
    }
  };

  handleDrag = (e, ui) => {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  onStart = () => {
    this.setState({activeDrags: ++this.state.activeDrags});
  };

  onStop = () => {
    this.setState({activeDrags: --this.state.activeDrags});
  };

  // For controlled component
  adjustXPos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {x, y} = this.state.controlledPosition;
    this.setState({controlledPosition: {x: x - 10, y}});
  };

  adjustYPos = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {controlledPosition} = this.state;
    const {x, y} = controlledPosition;
    this.setState({controlledPosition: {x, y: y - 10}});
  };

  onControlledDrag = (e, position) => {
    const {x, y} = position;
    this.setState({controlledPosition: {x, y}});
  };

  onControlledDragStop = (e, position) => {
    this.onControlledDrag(e, position);
    this.onStop();
  };

  render() {
    const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
    const {deltaPosition, controlledPosition} = this.state;
    return (
      <div id="xiaoyou">
        <h1>React Draggable</h1>
        <p>Active DragHandlers: {this.state.activeDrags}</p>
        <Draggable {...dragHandlers} >
          <div className="box">I can be dragged anywhere</div>
        </Draggable>
      

      </div>
    );
  }
}

class RemWrapper extends React.Component {
  // PropTypes is not available in this environment, but here they are.
  // static propTypes = {
  //   style: PropTypes.shape({
  //     transform: PropTypes.string.isRequired
  //   }),
  //   children: PropTypes.node.isRequired,
  //   remBaseline: PropTypes.number,
  // }

  translateTransformToRem(transform, remBaseline = 16) {
    const convertedValues = transform.replace('translate(', '').replace(')', '')
      .split(',')
      .map(px => px.replace('px', ''))
      .map(px => parseInt(px, 10) / remBaseline)
      .map(x => `${x}rem`)
    const [x, y] = convertedValues

    return `translate(${x}, ${y})`
  }

  render() {
    const { children, remBaseline = 16, style } = this.props
    const child = React.Children.only(children)

    const editedStyle = {
      ...child.props.style,
      ...style,
      transform: this.translateTransformToRem(style.transform, remBaseline),
    }

    return React.cloneElement(child, {
       ...child.props,
       ...this.props,
       style: editedStyle
    })
  }
}


ReactDOM.render(<App/>, document.getElementById('container'));
