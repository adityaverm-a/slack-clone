import React from 'react'
import RcDrawer from 'rc-drawer'

const Drawer = ({
    className,
    children,
    closeButton,
    closeButtonStyle,
    drawerHandler,
    toggleHandler,
    open,
    width,
    placement,
    drawerStyle,
    closeBtnStyle,
    ...props
}) => {
    return (
        <>
            <RcDrawer
                open={open}
                onClose={toggleHandler}
                className={`drawer ${className || ''}`.trim()}
                width={width}
                placement={placement}
                handler={false}
                level={null}
                duration={'0.4s'}
                {...props}
            >
                {closeButton && (
                    <div className='drawerCloseBtn' onClick={toggleHandler}>
                        {closeButton}
                    </div>
                )}
                <div className='drawerContainer'>
                    {children}
                </div>
            </RcDrawer>
            <div className='drawer__handler' style={{ display: 'inline-block', paddingRight: 0, paddingLeft: '7px' }} onClick={toggleHandler}>
                {drawerHandler}
            </div>
        </>
    )
}

Drawer.defaultProps = {
    width: '320px',
    placement: 'left'
}

export default Drawer